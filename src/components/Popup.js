import React, { Component } from 'react';
import moment from 'moment';

export default class Popup extends React.Component {
  render() {
    const { popDate, popSubject, popAssign, popDur, togglePopup } = this.props;
    let formattedDate = moment(popDate).format('ll') 
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h2>{popSubject}</h2>
          <p>{popAssign}</p>
          <h4>{`${popDur} minutes on ${formattedDate}.`}</h4>
        <button onClick={togglePopup}>Close</button>
        </div>
      </div>
    );
  }
}

