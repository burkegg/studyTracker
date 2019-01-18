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
      data: [],
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
    };
  };

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

  getTenDays(data, lastDay) {
    if (!data) return;
    let idx = data.length - 1;
    let dates = {};
    // Get an object with 10 date keys
    while (idx >= 0) {
      if (Object.keys(dates).length === 10 && !dates.hasOwnProperty(dates[data[idx].taskDate])) {
        break;
      }
      dates[data[idx].taskDate] = 'date added to hash';
      idx--; 
    }

    // Go through all data.  if it's in the hash, write it to our outgoing array.
    let outgoingData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].taskDate in dates) {
        outgoingData.push(data[i]);
      }
    }
    if (lastDay === undefined) {
      let firstVisible = outgoingData[0].taskDate;
      let lastVisible = outgoingData[outgoingData.length - 1].taskDate;
      this.setState({firstVisible: firstVisible, lastVisible: lastVisible});
    }
    return outgoingData;
  }

  replaceDashes(dashDate) {
    dashDate = dashDate.replace(/-/, '/');
    dashDate = dashDate.replace(/-/, '/');
    return dashDate;
  }

  arrowsToShow() {
    let { firstVisible, lastVisible, rawData } = this.state;
    // determine left arrow
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
      this.setState({ leftArrowVisible: true });
    } else {
      this.setState({ leftArrowVisible: false });
    }
    if (moment(rawEnd).isAfter(lastVisible)) {
      this.setState({ rightArrowVisible: true });
    } else {
      this.setState({ rightArrowVisible: false });
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
    if(!data) return;
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
  }

  dataToRectLocs(data) {
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
  
  componentDidMount() {
    this.getUser()
    // this.getTasks();
  }

  handleScrollButtons = (e) => {
    return;
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

  render() {
    const { loggedIn, redirectTo, series, maxHeight, leftArrowVisible, rightArrowVisible } = this.state;
    return (
      <div className="App">
        <Navbar
          loggedIn={this.state.loggedIn}
          logout={this.logout}
          rightArrowVisible={rightArrowVisible}
          leftArrowVisible={leftArrowVisible}
        />
        <Switch>
          <Route
            exact path="/"
            render={props => <Main {...props}
            cheatTasks={this.cheatTasks}
            series={series}
            handleNewTask={this.handleNewTask}
            loggedIn={loggedIn}
            maxHeight={maxHeight}
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
