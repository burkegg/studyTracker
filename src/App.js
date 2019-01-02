import React, { Component } from 'react';
import ScrollButtons from './components/ScrollButtons';
import { Route, Link, Switch } from 'react-router-dom';
import Graph from './components/Graph';
import BottomButtons from './components/BottomButtons';
import axios from 'axios';
import * as d3 from 'd3';
import SignupForm from './components/Signup';
import LoginForm from './components/LoginForm';
import Main from './components/Main';
import Navbar from './components/Navbar';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: null,
      id: null,
    };
  };

  updateUser = (userObject) => {
    this.setState(userObject);
  }

  getUser = () => {
    axios.get('/user/').then(response => {
      //console.log('response data', response.data)
      if (response.data.user !== null && response.data.user !== undefined) {
        console.log('Get User: There is a user saved in the server session: ')

        this.setState({
          loggedIn: true,
          username: response.data.user.username,
          id: response.data.user._id,
        })
      } else {
        console.log('Get user: no user');
        this.setState({
          loggedIn: false,
          username: null
        })
      }
    })
  }

  

  

  componentDidMount() {
    this.getUser();
    // this.getGraphHeight();
    // this.getTasks();
  }

  pullUpTime = (intervalSeconds) => {
    this.setState({ intervalSeconds: intervalSeconds })
  }


  render() {
    console.log(this.state.loggedIn, this.state.username)
    return (
      <div className="App">
        <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
        {/* greet user if logged in: */}
        {this.state.loggedIn &&
          <p>Join the party, {this.state.username}!</p>
        }
        {/* Routes to different components */}
        <Switch>
          <Route
            exact path="/"
            render={props => <Main {...props} loggedIn={this.state.loggedIn} testProps={`test message 123`} />}
          />
          <Route
            path="/login"
            render={() =>
              <LoginForm
                updateUser={this.updateUser}
              />}
          />
          <Route
            path="/signup"
            render={() =>
              <SignupForm
                signup={this.signup}
              />}
          />
        </Switch>
      </div>
    );
  }
}
