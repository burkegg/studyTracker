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
    let str = event.target.value;
    if (this.testSafety(str) && str.length <= 30) {
      this.setState({
        [event.target.name]: event.target.value
      })
    } else {
      console.log('FORBIDDEN TEXT!!!!')
    }
  }

  testSafety(string) {
    var regex = new RegExp('\[a-zA-Z0-9!@#$%^&*()=_+;:.,?\-]');
    let passing = true;
    for (let i = 0; i < string.length; i++) {
      let letter = string[i];
      passing = passing && regex.test(letter);
    }
    return passing;
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
      // console.log('it wants to redirect');
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
        <div className="SignupForm">
          <h2>Signup form</h2>
          <form>
            <div>
              <label htmlFor="username">Username: </label>
            </div>
            <input
              className="formInput"
              type="text"
              name="username"
              placeholder="At least 5 characters"
              value={this.state.username}
              onChange={this.handleChange}
            />
            <div>
                <div>
                  <label htmlFor="password">Password: </label>
                </div>
            <input
              className="formInput"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={this.state.password}
              onChange={this.handleChange}
            />
            </div>
            <div>
            <button id="signupButton" onClick={this.handleSubmit}>Sign up</button>
            </div>
          </form>
        </div>
      )
    }
  }
}

export default SignupForm
