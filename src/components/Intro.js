import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';


export default function Intro(props) {
  if (props.loggedIn) {
      console.log('>>>>> Redirecting?!?!?!')
      return <Redirect to={{ pathname: '/' }} />
  } else {
    return(
      <div>
        <h3>Graph My Time</h3>
        <p>Keep track of time spent on each class.</p>
        <img src='./toS3/example.jpg' alt="an example graph" />
        <p>"It's not procrastination if you use graphs!"   ¯\_(ツ)_/¯</p>
      </div>
    )
  }
}