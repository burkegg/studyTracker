import React, { Component } from 'react';
import ScrollButtons from './ScrollButtons';
import Graph from './Graph.js';
import BottomButtons from './BottomButtons';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      recording: 'prestart',
      graphHeight: 0,
      width: 0,
      intervalSeconds: 0,
    };
  };

  getTasks = () => {
    let url = '/api/tasks'
    console.log('getting tasks updated');
    axios.get(url)
    .then(result => {
      console.log(result)
      this.setState({ data: result.data })
    })
    .catch(error => {
      console.log('ERROR', error);
    })
  }

  apiPost = (toPost) => {
    console.log('called api placeholder function with', toPost);
  }

  handleScrollButtons = (e) => {
    console.log(e);
    return;
  }
  handleStartButton = (e) => {
    console.log(e);
    this.setState({recording: 'started'})
    return;
  }

  handleStopButton = (intervalSeconds) => {
    this.setState({recording: 'stopped', intervalSeconds: intervalSeconds })
  }

  handleResumeButton = (e) => {
    console.log(e);
    this.setState({ recording: 'started'})
  }

  handleFinishButton = (e) => {
    console.log(e);
    this.setState({recording: 'finalize', })
  }

  handleCancelButton = (e) => {
    console.log(e);
    let confirmation = window.confirm('Press OK to delete your assignment.');
    if (confirmation) {
      console.log('we are about to cancel');
      this.handleCancelConfirm();
    } else {
      console.log('we aint gonna cancel nothin');
    }
  }

  handleCancelConfirm = (e) => {
    this.setState({ intervalSeconds: 0, recording: 'prestart' })
  }

  handleNewTask = (courseName, assignment, notes) => {
    let { data, intervalSeconds } = this.state;
    let currId = data[data.length - 1].id;
    
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
        this.setState({ data: data, recording: 'prestart', intervalSeconds: 0 });
        return;
      }
    }

    let addTask = {id: currId, date: formattedDate, duration: minutesTaken, subject: courseName, notes: notes};
    data.push(addTask);
    this.setState({ data: data, recording: 'prestart', intervalSeconds: 0 });
    this.apiPost('some data');
    currId += 1;
  }

  getGraphHeight = () => {
    let element = document.getElementById("graph");
    let graphHeight = element.clientHeight;
    let width = element.clientWidth;
    this.setState({ graphHeight: graphHeight, width: width });
  }

  componentDidMount() {
    this.getGraphHeight();
    this.getTasks();
  }

  pullUpTime = (intervalSeconds) => {
    this.setState({ intervalSeconds: intervalSeconds })
  }


  render() {
    const { recording, data, graphHeight, width, intervalSeconds } = this.state;
    return(
      <div>
        <div id="topBar">
          <div id="topBarLeft">
            placeholder for top Left
          </div>
          <div id="ScrollButtonsOutermost">
            <ScrollButtons handleScrollButtons={this.handleScrollButtons}/>
          </div>
        </div>

        <div id="graph">
          <Graph data={data} graphHeight={graphHeight} width={width}/>
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
