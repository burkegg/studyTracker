import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import Graph from './Graph';
import BottomButtons from './BottomButtons';
import axios from 'axios';
import * as d3 from 'd3';
import BackButton from './BackButton';
import moment from 'moment';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      recording: 'prestart',
      graphHeight: 0,
      width: 0,
      intervalSeconds: 0,
      maxHeight: 0,
      userID: null,
      loggedIn: false,
      failed: false,
      redirectTo: null,
      firstVisible: null,
      lastVisible: null,
      rawData: null,
      leftArrowVisible: false,
      rightArrowVisible: false,
      allDates:[],
    };
  };

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

  getGraphHeight = () => {
    // the height available to make a graph
    let element = document.getElementById("graph");
    if (element) {
      let graphHeight = element.clientHeight;
      let width = element.clientWidth;
      this.setState({ graphHeight: graphHeight, width: width });
    }
  }

  componentDidMount() {
    this.getGraphHeight();
    if (this.props.loggedIn) {
      this.props.cheatTasks();
    }
  }

  passUpSubmit = (name, assign, notes) => {
    const { intervalSeconds } = this.state;
    const { handleNewTask } = this.props;
    handleNewTask(name, assign, notes, intervalSeconds);
    this.setState({ recording: 'prestart' })
  }

  render() {
    const { recording, graphHeight, width, intervalSeconds } = this.state;
    const { loggedIn, series, maxHeight} = this.props;
    if (!loggedIn) {
      return <Redirect to={{ pathname: '/Intro' }} />
    } else {
      return(
        <div id="main">
          <div id="graph">
            <Graph series={series} graphHeight={graphHeight} width={width} maxHeight={maxHeight}/>
          </div>
          <div id="bottomBar">
            <BottomButtons
              recording={recording} 
              handleStartButton={this.handleStartButton}
              handleStopButton={this.handleStopButton}
              handleFinishButton={this.handleFinishButton}
              handleCancelButton={this.handleCancelButton}
              handleCancelConfirm={this.handleCancelConfirm}
              handleResumeButton={this.handleResumeButton}
              handleNewTask={this.passUpSubmit}
              handleTimerStop={this.handleTimerStop}
              intervalSeconds={intervalSeconds}
            />
          </div>
        </div>
        )
    }
  }
}
