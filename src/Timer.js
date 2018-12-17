import React, { Component } from 'react';

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTime: 0,
      duration: 0,
      intervalSeconds: 0,
      loading: true,
    }
  }

  componentDidMount() {
    let startTime = Date.now();
    const { intervalSeconds } = this.props;
    this.setState({ duration: intervalSeconds, loading: false})
    this.timerID = setInterval(
      ()=>{
        let interval = Math.floor((Date.now() - startTime) / 1000) + intervalSeconds;
        this.setState({ duration: interval });
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
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
            <circle cx={width / 2} cy='52' r='45'fill='red' id="startButton" />
            <text x={width / 2} y='55' textAnchor='middle' style={buttonTextStyle}>{duration}</text>
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

