import React, { Component } from 'react';
import ScrollButtons from './ScrollButtons';
import { Route, Link, Redirect } from 'react-router-dom';
import Graph from './Graph';
import BottomButtons from './BottomButtons';
import axios from 'axios';
import * as d3 from 'd3';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      recording: 'prestart',
      graphHeight: 0,
      width: 0,
      intervalSeconds: 0,
      series: null,
      maxHeight: 0,
      userID: null,
      loggedIn: false,
      failed: false,
      redirectTo: null,
    };
  };

  getUser = () => {
    axios.get('/user/').then(response => {
      if (response.data.user) {
        this.setState({
          loggedIn: true,
          username: response.data.user.username,
          userID: response.data.user._id,
        })
      } else {
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }

  getTasks = () => {
    const { userID } = this.state;
    let url = '/api/tasks'
    let maxHeight = 0;
    let series;
    axios.get(url, {
      // this is temporary id placeholder
      userID: userID,
    })
    .then(result => {
      if (result.data.length === 0) {return result.data}
      return this.getTenDays(result.data);
    })
    .then((tenDaysData) => {
      if (tenDaysData.length === 0) {return []}
      series = this.dataToRectLocs(tenDaysData);
      maxHeight = this.getMaxHeight(series);
      this.setState({ series: series, maxHeight: maxHeight, recording: 'prestart' });
      return series;
    })
    .catch(error => {
      console.log('Error getting tasks from server:', error);
    })
  }

  apiPost = (toPost) => {
    const { userID } = this.state;
    let url = '/api/tasks'
    toPost.duration = Math.ceil(toPost.duration / 60);
    axios.post(url, {
      userID: userID,
      date: toPost.date,
      duration: toPost.duration,
      subject: toPost.subject,
      assign: toPost.notes,
      notes: toPost.notes,
    })
    .then(() => {
      this.getTasks();
    })
    .catch(error => {
      console.log('error on post', error);
    })
  }

  apiUpdate = (toUpdate) => {
    const { userID } = this.state;
    let url = '/api/tasks';

    axios.post(url, {
      userID: toUpdate.userID,
      subject: toUpdate.subject,
      assign: toUpdate.notes,
      notes: toUpdate.notes,
      date: toUpdate.formattedDate,
      duration: toUpdate.duration,
    })
    .catch(error => {
      console.log('error on patch', error);
    })
  }

  getTenDays(data) {
    if (!data) return;
    data = data.sort((a, b) => {
      let aDate = new Date(a.date);
      let bDate = new Date(b.date);
      if (aDate < bDate) {
        return -1;
      } else {
        return 1;
      }
    })
    let idx = data.length - 1;
    let dates = {};
    let cutting = false;
    while (idx >= 0) {
      if (Object.keys(dates).length === 10 && !dates.hasOwnProperty(dates[data[idx].taskDate])) {
        cutting = true;
        break;
      }
      dates[data[idx].taskDate] = dates[data[idx].taskDate] || 1;
      idx--; 
    }
    if (cutting) {
      data = data.slice(idx + 1);
    }
    return data;
  }



  getMaxHeight(seriesData) {
    let topRow = seriesData[seriesData.length - 1];
    let maxHeight = 0;
    for (let i = 0; i < topRow.length; i++) {
      maxHeight = (topRow[i][1] > maxHeight) ? topRow[i][1] : maxHeight;
    }
    return maxHeight;
  }

  dataToRectLocs(data) {
    let formatData = [];
    let hash = {};
    let templateDay = {};
    let allKeys = [];
    for (let i = 0; i < data.length; i++) {
      let subject = data[i].subject;
      if (!templateDay.hasOwnProperty(data[subject])) {
        templateDay[subject] = 0;
      }
    }
    for (let i = 0; i < data.length; i++) {
      // here only compare the first 10 digits...
      // Cheap fix //
      let tempDate = data[i].taskDate;
      tempDate = tempDate.slice(0, 10);
      tempDate = tempDate.replace(/-/, '/');
      tempDate = tempDate.replace(/-/, '/');
      tempDate = new Date(tempDate);
      data[i].taskDate = tempDate;
      if (!hash.hasOwnProperty(data[i].taskDate)) {
        let tempDay = Object.assign({}, templateDay);
        let subj = data[i].subject;
        tempDay[subj] = data[i].duration;
        hash[data[i].taskDate] = tempDay;
      } else {
        let tempDay = Object.assign({}, hash[data[i].taskDate]);
        tempDay[data[i].subject] = data[i].duration;
        hash[data[i].taskDate] = tempDay;
      }
    }
    for (let key in templateDay) {
      allKeys.push(key);
    }
    // make an array with each day as object, with date.
    let allDays = Object.keys(hash);
    for (let i = 0; i < allDays.length; i++) {
      let storage = hash[allDays[i]];
      storage.date = allDays[i].slice(0, 10);
      formatData.push(storage);
    }
    var stack = d3.stack()
    .keys(allKeys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
    let series = stack(formatData);
    return series;
  }

  handleScrollButtons = (e) => {
    return;
  }
  handleStartButton = (e) => {
    this.setState({recording: 'started'})
    return;
  }

  handleStopButton = (intervalSeconds) => {
    this.setState({recording: 'stopped', intervalSeconds: intervalSeconds })
  }

  handleResumeButton = (e) => {
    this.setState({ recording: 'started'})
  }

  handleFinishButton = (e) => {
    this.setState({recording: 'finalize', })
  }

  handleCancelButton = (e) => {
    let confirmation = window.confirm('Press OK to delete your assignment.');
    if (confirmation) {
      this.handleCancelConfirm();
    } 
  }

  handleCancelConfirm = (e) => {
    this.setState({ intervalSeconds: 0, recording: 'prestart' })
  }

  handleNewTask = (courseName, assignment, notes) => {
    let { intervalSeconds, data, userID } = this.state;
    let date = new Date();
    let formattedDate = `${date.toDateString().slice(11)}/${date.getMonth() + 1}/${date.getDate()}`;
    if (notes.length === 0 || notes === undefined) {
      notes = null;
    }
    let minutesTaken = Math.floor(intervalSeconds / 1);
    if (minutesTaken < 1) {
      return;
    }
    // check to see if we're adding this to the same course on the same day...
    // if so, add it to that one, and return early
    // don't incremement currId

    for (let idx = data.length - 1; idx >= 0; idx--) {
      if (data[idx].date === formattedDate && data[idx].subject === courseName) {
        let tempDataObj = data[idx]
        tempDataObj.duration = tempDataObj.duration + minutesTaken;
        tempDataObj.notes = tempDataObj.notes + notes;
        data[idx] = tempDataObj;
        return;
      }
    }

    let addTask = {userID: userID, date: formattedDate, duration: minutesTaken, subject: courseName, notes: notes};
    this.apiPost(addTask);
    this.setState({ intervalSeconds: 0 });
  }

  getGraphHeight = () => {
    let element = document.getElementById("graph");
    if (element) {
      let graphHeight = element.clientHeight;
      let width = element.clientWidth;
      this.setState({ graphHeight: graphHeight, width: width });
    }
  }

  componentDidMount() {
    // this.getUser();
    this.getGraphHeight();
    this.getTasks();

  }

  pullUpTime = (intervalSeconds) => {
    this.setState({ intervalSeconds: intervalSeconds })
  }


  render() {
    const { recording, series, graphHeight, width, intervalSeconds, maxHeight } = this.state;
    const { loggedIn } = this.props;
    if (!loggedIn) {
      return <Redirect to={{ pathname: '/Intro' }} />
    } else {
      return(
        <div>
          {/*<div id="topBar">
            <div id="topBarLeft">
              placeholder for top Left
            </div>
            <div id="ScrollButtonsOutermost">
              <ScrollButtons handleScrollButtons={this.handleScrollButtons}/>
            </div>
          </div>*/}

          <div id="graph">
            <Graph series={series} graphHeight={graphHeight} width={width} maxHeight={maxHeight}/>
          </div>
          <div id="bottomBar">
            <BottomButtons recording={recording} 
              handleStartButton={this.handleStartButton}
              handleStopButton={this.handleStopButton}
              handleFinishButton={this.handleFinishButton}
              handleCancelButton={this.handleCancelButton}
              handleCancelConfirm={this.handleCancelConfirm}
              handleResumeButton={this.handleResumeButton}
              handleNewTask={this.handleNewTask}
              handleTimerStop={this.handleTimerStop}
              pullUpTime={this.pullUpTime}
              intervalSeconds={intervalSeconds}
            />
          </div>
        </div>
        )
    }
  }
}
