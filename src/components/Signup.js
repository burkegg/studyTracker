import React, { Component } from 'react'
import axios from 'axios';
import { Route, Redirect } from 'react-router';

class SignupForm extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      redirect: null,
      userID: null,
      
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }
  handleSubmit(event) {
    event.preventDefault()
    console.log('sign-up-form, username: ');
    console.log('username', this.state.username, 'pass', this.state.password);
    //request to server here
    axios.post('/user/', {
      username: this.state.username,
      password: this.state.password
    })
      .then(response => {
        console.log(response)
        if (!response.data.errmsg) {
          console.log('successful signup', response)
          this.setState({ //redirect to login page
            redirectTo: '/login'
          })
          console.log('firing getUser()');
          this.props.getUser(this.state.username, this.state.password);
        } else {
          console.log(response.data.errmsg);
        }
      }).catch(error => {
        console.log('signup error: ')
        console.log(error)
      })
  }


  render() {
    if (this.state.redirectTo) {
      console.log('it wants to redirect');
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {

      return (
        <div className="SignupForm">
          <h1>Signup form</h1>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <button onClick={this.handleSubmit}>Sign up</button>
        </div>
      )
    }
  }
}

export default SignupForm
