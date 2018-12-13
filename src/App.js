import React, { Component } from 'react';
import ScrollButtons from './ScrollButtons';
import Graph from './Graph.js';
import BottomButtons from './BottomButtons';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {id: 1, date: '2018-11-26', duration: 30, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 2, date: '2018-11-28', duration: 35, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 3, date: '2018-11-28', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 4, date: '2018-11-29', duration: 15, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 5, date: '2018-11-29', duration: 30, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 6, date: '2018-11-29', duration: 40, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 7, date: '2018-12-1', duration: 60, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 8, date: '2018-12-2', duration: 50, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 9, date: '2018-12-3', duration: 20, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 10, date: '2018-12-5', duration: 25, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 11, date: '2018-12-6', duration: 10, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 12, date: '2018-12-6', duration: 55, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 13, date: '2018-12-7', duration: 5, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 14, date: '2018-12-7', duration: 20, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 15, date: '2018-12-7', duration: 10, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 16, date: '2018-12-7', duration: 80, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 17, date: '2018-12-8', duration: 25, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 18, date: '2018-12-8', duration: 15, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 19, date: '2018-12-8', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 20, date: '2018-12-8', duration: 20, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
        {id: 21, date: '2018-12-8', duration: 15, subject: 'PE', assign: 'vocab worksheet', notes: 'bestwork'},
      ],
      recording: 'finalize',
      graphHeight: 0,
      width: 0,
    };
  };

  handleScrollButtons = (e) => {
    console.log(e);
    return;
  }
  handleStartButton = (e) => {
    console.log(e);
    this.setState({recording: 'started'})
    return;
  }

  handleStopButton = (e) => {
    console.log(e);
    this.setState({recording: 'stopped'})
  }

  handleResumeButton = (e) => {
    console.log(e);
    this.setState({ recording: 'started'})
  }

  handleFinishButton = (e) => {
    console.log(e);
    this.setState({recording: 'finalize'})
  }

  handleCancelButton = (e) => {
    console.log(e);
  }

  handleCancelConfirm = (e) => {
    console.log(e);
  }

  handleNewTask = (courseName, assignment, notes) => {
    console.log(courseName, assignment, notes);
    let { data } = this.state;
    let currId = data[data.length - 1].id;
    currId += 1;
    let date = new Date().toDateString();
    if (notes.length === 0 || notes === undefined) {
      notes = null;
    }
    let addTask = {id: currId, date: date, duration: 24, subject: courseName, notes: notes};
    data.push(addTask);
    console.log(data);
    this.setState({ data: data });
  }

  getGraphHeight = () => {
    let element = document.getElementById("graph");
    let graphHeight = element.clientHeight;
    let width = element.clientWidth;
    this.setState({ graphHeight: graphHeight, width: width });
  }

  componentDidMount() {
    this.getGraphHeight();
  }

  render() {
    const { recording, data, graphHeight, width } = this.state;
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
          />
        </div>
      </div>
      )
  }
}
