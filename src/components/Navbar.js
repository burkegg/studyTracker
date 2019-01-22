import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'
import axios from 'axios'
import BackButton from './BackButton';

class Navbar extends Component {
  constructor() {
    super()
  }
  

  showLeft = () => {
    if (this.props.leftArrowVisible) {
      return(<BackButton side={'left'} handleScrollButtons={this.props.handleScrollButtons}/>)
    } else {
      return(<span></span>);
    }
  }

  showRight = () => {
    if (this.props.rightArrowVisible) {
      return(<BackButton side={'right'} handleScrollButtons={this.props.handleScrollButtons}/>)
    } else {
      return(<span></span>);
    }
  }

  render() {
    const {loggedIn, logout, leftArrowVisible, rightArrowVisible } = this.props; 

    return (
        <header className="navbar App-header" id="nav-container">
            {loggedIn ? (
              <div className="loggedIn">
                <div>
                {this.showLeft()}
                  <Link to="#" className="btn" onClick={logout}>
                    <span>logout</span>
                  </Link>
                  {this.showRight()}
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