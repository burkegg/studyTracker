import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import Graph from './components/Graph';
import BottomButtons from './components/BottomButtons';
import axios from 'axios';
import * as d3 from 'd3';
import SignupForm from './components/Signup';
import LoginForm from './components/LoginForm';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Intro from './components/Intro';
import moment from 'moment';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: null,
      userID: null,
      id: null,
      redirectTo: '/Intro',
      series: null,
      intervalSeconds: 0,
      series: null,
      maxHeight: 0,
      failed: false,
      firstVisible: null,
      lastVisible: null,
      rawData: null,
      leftArrowVisible: false,
      rightArrowVisible: false,
      allDates:[],
      showPopup: false,
      popSubject: null,
      popAssign: null,
      popDur: null,
      popDate: null,
    };
  };

  togglePopup = (subject, taskDate, assign, duration) => {
    let { showPopup } = this.state;
    this.setState({ showPopup: !showPopup });
    console.log('inside togglePopup()', subject, taskDate, assign);
    this.setState({ popSubject: subject, popAssign: assign, popDur: duration, popDate: taskDate })
  }

  updateUser = (userObject) => {
    this.setState(userObject);
  }

  logout = (event) => {
    console.log('logging out?');
    event.preventDefault()
    axios.post('/user/logout').then(response => {
      if (response.status === 200) {
        this.updateUser({
          loggedIn: false,
          username: null
        })
      }
    }).catch(error => {
        console.log('Logout error')
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
      assign: toPost.assign,
      notes: toPost.notes,
    })
    .then(() => {
      this.getTasks();
    })
    .catch(error => {
      console.log('error on post', error);
    })
  }

  getTenDays(data, lastDay) {
    /* 
    takes a sorted array of data and the last of 10 days to trace back from
    returns the subset of the original array that fits into 10 days
    TO DO:  fix the back scroll so that it doesn't end up with only 1 thing on the left
    */
    if (!data) return [];
    lastDay = lastDay || new Date();
    lastDay = new moment(lastDay);
    let endSubset;
    // Go through possibilities of where lastDay falls relative to data.

    // if LastDay is after the last entry, set lastDay to that taskDate.
    let lastDataDate = new moment(data[data.length - 1].taskDate);
    if (lastDay.isAfter(lastDataDate)) {
      lastDay = lastDataDate;
    }
    // if lastDay is before the first entry, set lastDay to ten days after the first entry.
    let firstDataDate = new moment(data[0].taskDate);
    if (lastDay.isBefore(firstDataDate)) {
      lastDay = firstDataDate.add(10, 'days');
    }
    // if lastDay falls too close to the left end, shift it right a little
    // if (lastDay.subtract(10, 'days').isBefore(firstDataDate)) {
    //   lastDay = firstData.add(10, 'days');
    // }

    // search backwards through the array until we get to one where the date is lastDay
    for (let idx = data.length - 1; idx >= 0; idx--) {
      if (moment(data[idx].taskDate).isSame(lastDay, 'day')) {
        endSubset = idx;
        break;
        }
    }

    let dates = {};
    for (let idx = endSubset; idx >= 0; idx--) {
      if (Object.keys(dates).length === 10 && !dates.hasOwnProperty(dates[data[idx].taskDate])) {
        break;
      }
      dates[data[idx].taskDate] = 'date added to hash';
    }

    // Go through all data.  if it's in the hash, write it to our outgoing array.
    let outgoingData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].taskDate in dates) {
        outgoingData.push(data[i]);
      }
    }
    //if (lastDay === undefined) {
      let firstVisible = outgoingData[0].taskDate;
      let lastVisible = outgoingData[outgoingData.length - 1].taskDate;
      this.setState({firstVisible: firstVisible, lastVisible: lastVisible});
    //}
    return outgoingData
  }

  replaceDashes(dashDate) {
    dashDate = dashDate.replace(/-/, '/');
    dashDate = dashDate.replace(/-/, '/');
    return dashDate;
  }

  arrowsToShow() {
    let { firstVisible, lastVisible, rawData } = this.state;
    // determine left arrow
    if (!rawData || !firstVisible || !lastVisible) return;
    let rawStart = rawData[0].taskDate;
    let rawEnd = rawData[rawData.length - 1].taskDate;
    rawStart = rawStart.slice(0, 10);
    rawStart = this.replaceDashes(rawStart);
    rawEnd = rawEnd.slice(0, 10);
    rawEnd = this.replaceDashes(rawEnd);
    firstVisible = firstVisible.slice(0, 10);
    firstVisible = this.replaceDashes(firstVisible);
    lastVisible = lastVisible.slice(0, 10);
    lastVisible = this.replaceDashes(lastVisible);
    rawStart = new Date(rawStart).toISOString();
    rawEnd = new Date(rawEnd).toISOString();
    firstVisible = new Date(firstVisible).toISOString();
    lastVisible = new Date(lastVisible).toISOString();
    if (moment(rawStart).isBefore(firstVisible)) {
      this.setState({ leftArrowVisible: true }, ()=>{console.log('state leftArrowVisible:', this.state.leftArrowVisible)});
    } else {
      this.setState({ leftArrowVisible: false }, ()=>{console.log('state leftArrowVisible:', this.state.leftArrowVisible)});
    }
    if (moment(rawEnd).isAfter(lastVisible)) {
      this.setState({ rightArrowVisible: true }, ()=>{console.log('state rightArrowVisible:', this.state.rightArrowVisible)});
    } else {
      this.setState({ rightArrowVisible: false }, ()=>{console.log('state rightArrowVisible:', this.state.rightArrowVisible)});
    }
  }

  getMaxHeight(seriesData) {
    let topRow = seriesData[seriesData.length - 1];
    let maxHeight = 0;
    for (let i = 0; i < topRow.length; i++) {
      maxHeight = (topRow[i][1] > maxHeight) ? topRow[i][1] : maxHeight;
    }
    return maxHeight;
  }

  formatSortDates(data) {
    if(!data) return [];
    for (let i = 0; i < data.length; i++) {
      data[i].taskDate = data[i].taskDate.slice(0, 10);
      data[i].taskDate = this.replaceDashes(data[i].taskDate)
      data[i].taskDate = new Date(data[i].taskDate).toISOString();
    }
    data = data.sort((a, b) => {
      let aDate = a.taskDate;
      let bDate = b.taskDate;
      if (aDate < bDate) {
        return -1;
      } else {
        return 1;
      }
    })
    return data;
  }

  getTasks = (userID) => {
    //const { userID } = this.state;
    let url = '/api/tasks'
    let maxHeight = 0;
    let series;
    axios.get(url, {
      userID: userID,
    })
    .then(result => {
      if (result.data.length === 0 || !Array.isArray(result.data)) {return []}
      let data = this.formatSortDates(result.data);
      let tenDaysData = this.getTenDays(data);
      if (tenDaysData.length === 0) {return []}
      series = this.dataToRectLocs(tenDaysData);
      maxHeight = this.getMaxHeight(series);
      this.setState({ series: series, maxHeight: maxHeight, recording: 'prestart', rawData: data }, () => {
        this.arrowsToShow();
      });
    })
    .catch(error => {
      console.log('Error getting tasks from server:', error);
    })
  }

  getUser = (username = this.state.username, password = this.state.password) => {
    console.log('getusercalled')
    axios.get('/user/')
    .then(response => {
      if (response.data.user !== null && response.data.user !== undefined) {
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
    .catch(err => {
      console.log(err);
    })
  }

  dataToRectLocs(data) {
    if (!data) return [];
    let formatData = [];
    let hash = {};
    let templateDay = {};
    let allKeys = [];
    for (let i = 0; i < data.length; i++) {
      let subject = data[i].subject;

      // Right now we are seeing if a subject is in template day
      // and if not, setting 
      // templateDay =>. {subject: 0}

      if (!templateDay.hasOwnProperty(data[subject])) {
        templateDay[subject] = 0;
      }
    }
    for (let i = 0; i < data.length; i++) {
      // here only compare the first 10 digits...
      // Cheap fix //
      let tempDate = data[i].taskDate;
      tempDate = tempDate.slice(0, 10);
      tempDate = this.replaceDashes(tempDate);
      data[i].taskDate = tempDate;
      if (!hash.hasOwnProperty(data[i].taskDate)) {
        let tempDay = Object.assign({}, templateDay);
        let subj = data[i].subject;
        tempDay[subj] = data[i].duration;
        hash[data[i].taskDate] = tempDay;
      } else {
        let tempDay = Object.assign({}, hash[data[i].taskDate]);
        if (tempDay[data[i].subject] === 0) {
          tempDay[data[i].subject] = data[i].duration;  
        } else {
          tempDay[data[i].subject] = tempDay[data[i].subject] + data[i].duration;
        }
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

  handleTaskClick = (subject, taskDate, id) => {
    console.log('inside handleTaskClick', 'subject', subject, 'taskDate', taskDate, 'domid', id);
    const { series, rawData } = this.state;
    console.log(rawData);
    let taskMoment = moment(taskDate);
    for (let i = 0; i < rawData.length; i++) {
      let tempDate = new Date(rawData[i].taskDate).toISOString().slice(0, 10);
      tempDate = this.replaceDashes(tempDate);
      let rawMoment = moment(tempDate);
      // console.log(rawMoment);
      if (rawData[i].subject === subject && taskMoment.isSame(rawMoment, 'day')) {
        console.log('found one', subject, taskDate, rawData[i].assign);
        this.togglePopup(subject, taskDate, rawData[i].assign, rawData[i].duration);
      }
    }
    // Easier cheat:  if the date and subject match, get the assignment from state
  }
  
  componentDidMount() {
    this.getUser()
    // this.getTasks();
  }

  handleScrollButtons = (side) => {
    let { lastVisible, rawData } = this.state;
    lastVisible = new moment(lastVisible);

    if (side === 'left') {
      // get a date 10 days previous to current right side of visible
      
      lastVisible = lastVisible.subtract(10, 'days');
    }
    else if (side === 'right') {
      // get a date 10 days previous to current right side of visible
      lastVisible = lastVisible.add(10, 'days');
    } else {
      console.log('Only left and right are allowed in handleScrollButtons');
    }

    lastVisible = lastVisible.toISOString();
    let tenDaysData = this.getTenDays(rawData, lastVisible);
    let series = this.dataToRectLocs(tenDaysData);
    let maxHeight = this.getMaxHeight(series);
    this.setState({ series: series, maxHeight: maxHeight, recording: 'prestart', lastVisible: lastVisible }, () => {
      this.arrowsToShow();
    });

  }

  cheatTasks = () => {
    this.getTasks();
  }

  handleNewTask = (courseName, assignment, notes, intervalSeconds) => {
    let { data, userID } = this.state;
    let date = new Date(); 
    let formattedDate = `${date.toDateString().slice(11)}/${date.getMonth() + 1}/${date.getDate()}`;
    if (notes.length === 0 || notes === undefined) {
      notes = null;
    }
    let minutesTaken = Math.floor(intervalSeconds / 1);
    if (minutesTaken < 1) {
      return;
    }
    // for (let idx = data.length - 1; idx >= 0; idx--) {
    //   if (data[idx].date === formattedDate && data[idx].subject === courseName) {
    //     let tempDataObj = data[idx]
    //     tempDataObj.duration = tempDataObj.duration + minutesTaken;
    //     tempDataObj.notes = tempDataObj.notes + notes;
    //     data[idx] = tempDataObj;
    //     return;
    //   }
    // }
    let addTask = {
      userID: userID,
      date: formattedDate,
      duration: minutesTaken,
      subject: courseName,
      assign: assignment,
      notes: notes};
    this.apiPost(addTask);
    this.setState({ intervalSeconds: 0 });
  }

  render() {
    const { loggedIn, redirectTo, series, maxHeight, leftArrowVisible, rightArrowVisible } = this.state;
    return (
      <div className="App">
        <Navbar
          loggedIn={this.state.loggedIn}
          logout={this.logout}
          rightArrowVisible={rightArrowVisible}
          leftArrowVisible={leftArrowVisible}
          handleScrollButtons={this.handleScrollButtons}
        />
        <Switch>
          <Route
            exact path="/"
            render={props => <Main {...props}
            showPopup={this.state.showPopup}
            togglePopup={this.togglePopup}
            handleTaskClick={this.handleTaskClick}
            cheatTasks={this.cheatTasks}
            series={series}
            handleNewTask={this.handleNewTask}
            loggedIn={loggedIn}
            maxHeight={maxHeight}
            popSubject={this.state.popSubject}
            popDate={this.state.popDate}
            popAssign={this.state.popAssign}
            popDur={this.state.popDur}
          />}
          />
          <Route
            path="/login"
            render={() =>
              <LoginForm
                updateUser={this.updateUser}
                handleLogin={this.getUser}
                redirectTo={redirectTo}
              />}
          />
          <Route
            path="/signup"
            render={(props) =>
              <SignupForm
                {...props}
                signup={this.signup}
                updateUser={this.updateUser}
                getUser={this.getUser}
              />}
          />
          <Route
            path="/Intro"
            render={() => 
              <Intro loggedIn={loggedIn}/>}
          />
        </Switch>
      </div>
    );
  }
}
