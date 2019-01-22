import React, { Component } from 'react';

export default class BackButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: 'left',
    }
  }


  render() {


    let buttStyle = {
      width: '50px',
      height: '50px',
      margin: '5px',
    }
    let buttonHolder = {
      display: 'flex',
      width: '120px',
      height: '55px',
      margin: 'auto',
    }

    if (this.props.side === 'left') {
      return (
        <g style={buttonHolder} id="leftButton" onClick={()=>{this.props.handleScrollButtons('left')}} style={buttStyle}>
          <svg width='45px' height='45px' x='0' y='0'>
            <path d='M40 5 L10 25 L40 45' stroke='black' fill='purple' fillOpacity='.2'/>
          </svg>
        </g>
      )
    }

    if (this.props.side === 'right') {
      return (
        <g style={buttonHolder} id="leftButton" onClick={()=>{this.props.handleScrollButtons('right')}} style={buttStyle}>
          <svg width='45px' height='45px' x='0' y='0'>
            <path d='M10 5 L40 25 L10 45' stroke='black' fill='purple' fillOpacity='.2'/>
          </svg>
        </g>
      )
    }
  }
}