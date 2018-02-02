import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from './actionCreators';

class SignIn extends Component {
  state = {
    email: '',
    password: ''
  };

  handleChange = (event) => {
    this.setState({
      [event.target.dataset.type]: event.target.value
    })
  }

  login = () => {
    this.props.login({
      credential: {
        email: this.state.email,
        password: this.state.password
      },
      callbackSuccess: () => {
        this.props.history.push('/')
      }
    })
  }

  render() {
    return (
      <div>
        Sign In
        Email: <input type="text" data-type="email"
          value={this.state.email} onChange={this.handleChange} />
        Password: <input type="password" data-type="password"
          value={this.state.password} onChange={this.handleChange} />
        Don't have an account? <Link to="/register">Register</Link>
        <button type="button" onClick={this.login}>Log me in</button>
      </div>
    );
  }
}

SignIn.propTypes = {

};

export default connect(null, { login })(SignIn);