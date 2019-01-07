import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

class LoginForm extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      redirectTo: null
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
    console.log('handleSubmit login')

    axios
      .post('/user/login', {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log('login response: ')
        console.log(response)
        if (response.status === 200) {
          // update App.js state
          this.props.updateUser({
            loggedIn: true,
            username: response.data.username,
            userID: response.data.userID,
          })
          // update the state to redirect to home
          this.setState({
            redirectTo: '/'
          })
        }
      }).catch(error => {
        console.log('login error: ')
        console.log(error);
      })
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />
    } else {
      return (
        <div>
          <h2>Login</h2>

          <form className="form-horizontal">
            <div className="form-group">
              <div className="col-1 col-ml-auto">
                <label className="form-label" htmlFor="username">Username</label>
              </div>
              <div className="col-3 col-mr-auto">
                <input className="formInput"
                  type="text"
                  id="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-1 col-ml-auto">
                <label className="form-label" htmlFor="password">Password: </label>
              </div>
              <div className="col-3 col-mr-auto">
                <input className="formInput"
                  
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="form-group ">
              <div className="col-7"></div>
              <button
                className="btn btn-primary col-1 col-mr-auto"
                onClick={this.handleSubmit}
                type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      )
    }
  }
}

export default LoginForm
