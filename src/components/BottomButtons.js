import React, { Component } from 'react';
import Timer from './Timer';

export default class BottomButtons extends Component {
  constructor(props) {
    super(props);
    this.state= {
      width: '',
      courseName:'',
      notes:'',
      assignment:'',
      displayTime: 0,
    };
  }

  componentDidMount = () => {
    let element = document.getElementById("bottomBar");
    let width = element.clientWidth;
    this.setState({ width: width });
  }

  handleCourseNameChange = (e) => {
    e.preventDefault();
    this.setState({ courseName: e.target.value })
  }

  handleAssgnChange = (e) => {
    e.preventDefault();
    this.setState({assignment: e.target.value });
  }

  handleNotesChange = (e) => {
    e.preventDefault();
    this.setState({notes: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let { courseName, assignment, notes } = this.state;
    if (this.state.courseName.length >= 1) {
      this.props.handleNewTask(courseName, assignment, notes);
    }
  }

  render(){

    const { recording, handleStartButton, handleFinishButton, pullUpTime, handleStopButton,
            handleCancelButton, handleCancelConfirm, handleResumeButton, } = this.props;
    const { width } = this.state;
    let buttonTextStyle = {
      fontSize: '20px',
      fontWeight: 'bold',
    }
    // if it's prestart, show the start button.
    if (width === '') {
      return (<div>Loading Bottom Bar</div>)
    } else if (recording === 'prestart'|| recording === undefined) {
      return (
        <div>
          <svg width={width} height='100' x='0' y='0'>
          <g onClick={()=>{handleStartButton('from below!')}} >
            <circle cx={width / 2} cy='52' r='45'fill='green' id="startButton" />
            <text x={width / 2} y='55'textAnchor='middle' style={buttonTextStyle} >START</text>
          </g>
          </svg>
        </div>
      )
    } else if (recording === 'started') {
      // The stop button is a timer component
      return (
        <div>
          <Timer startTime={this.props.startTime} width={width} height='100' style={buttonTextStyle} pullUpTime={pullUpTime} handleStopButton={handleStopButton} intervalSeconds={this.props.intervalSeconds}/>
          
        </div>
      )
    } else if (recording === 'stopped') {
    return (
        <div>
          <svg width={width} height='70' x='0' y='0'>
          <g id='cancelButton' onClick = {()=>{handleCancelButton('cancel button pressed')}}>
            <rect x='10' y='10' height='20' width='50' fill='grey' stroke='black' fillOpacity='0.3' rx='4'/>
            <text x='35' y='25' textAnchor='middle'>Cancel</text>
          </g>
          <g onClick={()=>{handleResumeButton('resume was pushed')}}>
            <circle cx={width / 3} cy='35' r='30' fill='green' id="resume" fillOpacity='0.3'/>
            <text x={width / 3} y='39' textAnchor='middle'>RESUME</text>
          </g>

          <g onClick={()=>{handleFinishButton('finish was pushed')}}>
            <circle cx={2 * width / 3} cy='35' r='30' fill='blue' id="finish" fillOpacity='0.3'/>
            <text x={2 * width / 3} y='39' textAnchor='middle'>FINISH</text>
          </g>
          </svg>
        </div>
      ) 
    }else if (recording === 'finalize') {
      return (
        <div className="courseName">
          <form onSubmit={this.handleSubmit}>
            <div className='inputDiv'>
              <label htmlFor="className">
                <span className='inputLabel'>
                  What class?
                </span>
                <input
                  id="enterClass"
                  value={this.state.courseName}
                  placeholder="class - required"
                  onChange={this.handleCourseNameChange}
                />
              </label>
            </div>
            <div className='inputDiv'>
              <label htmlFor="assignment">
                <span className='inputLabel'>
                  Assignment?
                </span>
                <input
                  id="enterAssgn"
                  value={this.state.assignment}
                  placeholder="assignment"
                  onChange={this.handleAssgnChange}
                />
              </label>
            </div>
            <div className='inputDiv'>
              <label htmlFor="notes">
                <span className='inputLabel'>
                  Tag or note?
                </span>
                <input
                  id="enterAssgn"
                  value={this.state.notes}
                  placeholder="Tags or notes?"
                  onChange={this.handleNotesChange}
                />
              </label>
            
            <span id='submitButton'>
              <input type='submit' value='submit'/>
            </span>
            </div>

          </form>
        </div>
        )
    


   }
  }
}