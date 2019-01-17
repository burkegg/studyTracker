import React, { Component } from 'react';
//import ScrollButtons from './components/ScrollButtons';
import { Route, Link, Switch } from 'react-router-dom';
import Graph from './components/Graph';
import BottomButtons from './components/BottomButtons';
import axios from 'axios';
import * as d3 from 'd3';
import SignupForm from './components/Signup';
import LoginForm from './components/LoginForm';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Intro from './components/Intro';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: null,
      id: null,
      redirectTo: '/Intro',
    };
  };

  updateUser = (userObject) => {
    this.setState(userObject);
  }

  getUser = (username = this.state.username, password = this.state.password) => {
    axios.get('/user/').then(response => {
      if (response.data.user !== null && response.data.user !== undefined) {
        this.setState({
          loggedIn: true,
          username: response.data.user.username,
          userID: response.data.user._id,
        })
      } else {
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }

  // handleLogin = (event) => {
  //   event.preventDefault()
  //   axios
  //     .post('/user/login', {
  //       username: this.state.username,
  //       password: this.state.password
  //     })
  //     .then(response => {
  //       if (response.status === 200 && response.data.username) {
  //         // update App.js state
  //         console.log('response.data', response.data)
  //         this.props.updateUser({
  //           loggedIn: true,
  //           username: response.data.username,
  //           userID: response.data.userID,
  //         })
  //         // update the state to redirect to home
  //         this.setState({
  //           redirectTo: '/'
  //         })
  //       } else {
  //         this.setState({
  //           redirectTo: '/login'
  //         })
  //       }
  //     }).catch(error => {
  //       console.log('login error: ', error)
  //     })
  // }
  
  componentDidMount() {
    this.getUser();
    // this.getGraphHeight();
    // this.getTasks();
  }

  pullUpTime = (intervalSeconds) => {
    this.setState({ intervalSeconds: intervalSeconds })
  }

  render() {
    const { loggedIn, redirectTo } = this.state;
    return (
      <div className="App">
        <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
        {/* greet user if logged in: */}
         {//this.state.loggedIn &&
        //   <p>Join the party, {this.state.username}!</p>
        }
        {/* Routes to different components */}
        <Switch>
          <Route
            exact path="/"
            render={props => <Main {...props} loggedIn={loggedIn} />}
          />
          <Route
            path="/login"
            render={() =>
              <LoginForm
                updateUser={this.updateUser}
                handleLogin={this.getUser}
                redirectTo={redirectTo}
              />}
          />
          <Route
            path="/signup"
            render={(props) =>
              <SignupForm
                {...props}
                signup={this.signup}
                updateUser={this.updateUser}
                getUser={this.getUser}
              />}
          />
          <Route
            path="/Intro"
            render={() => 
              <Intro loggedIn={loggedIn}/>}
          />
        </Switch>
      </div>
    );
  }
}
