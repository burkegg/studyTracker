import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'
import axios from 'axios'
import BackButton from './BackButton';

class Navbar extends Component {
  constructor() {
    super()
  }

  render() {
    const {loggedIn, logout, leftArrowVisible, rightArrowVisible } = this.props; 

    return (
        <header className="navbar App-header" id="nav-container">
            {loggedIn ? (
              <div className="loggedIn">
                <div>
                  <Link to="#" className="btn" onClick={logout}>
                    <span>logout</span>
                  </Link>
                </div>
                {/*<div id = "forwardButton" className="scrollButton">
                  <BackButton />
                </div>*/}
              </div>
            ) : (
                <section className="loggedOut">
                  <Link to="/login" className="btn">
                    <span>login</span> 
                  </Link>
                  <Link to="/signup" className="btn">
                    <span>sign up</span>
                  </Link>
                </section>
              )}
        </header>
    );
  }
}

export default Navbar