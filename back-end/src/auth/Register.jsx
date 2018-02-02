import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from './actionCreators';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    confirmBoxDirty: false
  };

  handleChange = (event) => {
    if (event.target.dataset.type === 'confirmPassword') {
      this.setState({
        [event.target.dataset.type]: event.target.value,
        confirmBoxDirty: true
      })
    } else {
      this.setState({
        [event.target.dataset.type]: event.target.value
      })
    }
  }

  register = () => {
    this.props.register({
      credential: {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      },
      callbackSuccess: () => {
        this.props.history.push('/')
      }
    })
  }

  render() {
    const valid = this.state.name && this.state.email &&
    this.state.password && (this.state.password === this.state.confirmPassword);
    return (
      <div>
        Register
        Name: <input type="text" data-type="name"
          value={this.state.name} onChange={this.handleChange} />
        Email: <input type="text" data-type="email"
          value={this.state.email} onChange={this.handleChange} />
        Password: <input type="password" data-type="password"
          value={this.state.password} onChange={this.handleChange} />
        Confirm Password: <input type="password" data-type="confirmPassword"
          value={this.state.confirmPassword} onChange={this.handleChange} />
        <p>{ this.state.confirmBoxDirty && this.state.password !== this.state.confirmPassword ? 'Password not match' : ''}</p>
        Have an account? <Link to="/sign-in">SignIn</Link>
        <button type="button" disabled={!valid} onClick={this.register}>Register</button>
      </div>
    );
  }
}

Register.propTypes = {

};

export default connect(null, { register })(Register);