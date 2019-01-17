import React from 'react';

export default function ScrollButtons (props) {
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
  return (
    <div style={buttonHolder}>
      <div id="leftButton" onClick={()=>{props.handleScrollButtons('left')}} style={buttStyle}>
        <svg width='45px' height='45px' x='0' y='0'>
          <path d='M40 5 L10 25 L40 45' stroke='black' fill='purple' fillOpacity='.2'/>
        </svg>
      </div>
      <div id="rightButton" onClick={()=>{props.handleScrollButtons('right')}} style={buttStyle}>
      <svg width='45px' height='45px' x='0' y='0'>
          <path d='M10 5 L40 25 L10 45' stroke='black' fill='purple' fillOpacity='.2'/>
        </svg>
      </div>
    </div>
  )
}