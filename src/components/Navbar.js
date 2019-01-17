import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'
import axios from 'axios'
import BackButton from './BackButton';

class Navbar extends Component {
  constructor() {
    super()
    this.logout = this.logout.bind(this)
  }

  logout(event) {
    event.preventDefault()
    axios.post('/user/logout').then(response => {
      if (response.status === 200) {
        this.props.updateUser({
          loggedIn: false,
          username: null
        })
      }
    }).catch(error => {
        console.log('Logout error')
    })
  }

  render() {
    const loggedIn = this.props.loggedIn;    
    return (
        <header className="navbar App-header" id="nav-container">
            {loggedIn ? (
              <div className="loggedIn">
                {/*<div id="backButton" className="scrollButton">
                  <BackButton />
                </div>*/}
                <div>
                  <Link to="#" className="btn" onClick={this.logout}>
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