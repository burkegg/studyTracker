import React, { Component } from 'react';

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTime: '',
      duration: '',
      intervalSeconds: 0,
      loading: true,
      intervalFormatted: '',
    }
  }

  componentDidMount() {
    let startTime = Date.now();
    const { intervalSeconds } = this.props;
    this.setState({ duration: intervalSeconds, loading: false})
    this.timerID = setInterval(
      ()=>{
        let interval = Math.floor((Date.now() - startTime) / 1000) + intervalSeconds;
        let intervalFormatted = this.formatTime(interval);
        this.setState({ intervalFormatted: intervalFormatted, duration: interval });
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    this.setState({ duration: '' });
  }

  formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let remainder = seconds / 60 - min;
    let sec = 0;
    let secString = '';
    let minString = '';

    if (remainder > 0) {
      sec = Math.ceil(remainder * 60);
    }
    if (min > 0) {
      minString = `${min}m `;
    }
    if (sec > 0) {
      secString = `${sec}s`
    }
    let outString = minString + secString;
    return outString;
  }

  render() {
    const { width, buttonTextStyle, handleStopButton } = this.props
    let { duration, loading } = this.state;
    if (!loading) {
      return(
        <div>
        <svg width={width} height='100' x='0' y='0'>
            <g onClick={()=>{
              handleStopButton(duration);
            }}>
            <circle cx={width / 2} cy='52' r='45'fill='red'  />
            <text x={width / 2} y='55' textAnchor='middle' id="stopButton">{duration}</text>
            </g>
            </svg>
        </div>
      )
    } else {
      return(
        <div>
        Loading
        </div>
      )


    }
  }
}

