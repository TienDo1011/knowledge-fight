import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import {
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';

import {
  getRooms,
  saveToLocal,
  enterRoom,
  leaveRoom,
  start,
  finish,
} from './actionCreators';
import config from '../config';

const socket = io(config.server_url);

class Room extends Component {
  state = {
    started: false,
    finished: false,
    users: [],
  };

  handleChange = (event, value, questionNo) => {
    this.setState({
      [questionNo]: value,
    });
  };

  start = () => {
    const { room, start, user } = this.props;
    start({
      roomId: room._id,
      email: user.email,
    });
  };

  finish = () => {
    const { room, finish, user } = this.props;
    finish({
      roomId: room._id,
      email: user.email,
    });
  };

  componentDidMount() {
    const { room, user } = this.props;
    if (!room) {
      this.props.getRooms();
    }
    if (room) {
      socket.on(`${room._id}:updated`, ({ started, finished, users }) => {
        console.log('start the game', started, finished, users);
        this.setState({
          started,
          finished,
          users
        });
      });
      this.props.enterRoom({
        roomId: room._id,
        name: user.name,
        email: user.email
      });
    }
  }

  componentDidUpdate() {
    const userAnswers = [];
    Object.keys(this.state).forEach(
      key => (userAnswers[key] = this.state[key]),
    );
    this.props.saveToLocal(userAnswers);
  }

  componentWillUnmount() {
    const { room, user, leaveRoom } = this.props;
    if (room) {
      socket.off(`${room._id}:updated`);
      leaveRoom({
        roomId: room._id,
        email: user.email,
      });
    }
  }

  render() {
    const { room } = this.props;
    return (
      <div>
        {room &&
          this.state.started && (
            <div>
              <button onClick={this.finish}>Finish</button>
              {this.state.finished ? (
                ''
              ) : (
                <FormControl component="fieldset">
                  {room.questions.map(question => {
                    return (
                      <div key={question.no}>
                        <FormLabel component="legend">
                          Question: {question.question}
                        </FormLabel>
                        <RadioGroup
                          value={this.state[question.no]}
                          onChange={(event, value) =>
                            this.handleChange(event, value, question.no)
                          }
                        >
                          {question.answerOptions.map(aQ => (
                            <FormControlLabel
                              value={aQ.optionId}
                              key={aQ.optionId}
                              control={<Radio />}
                              label={`${aQ.optionName}: ${aQ.optionValue}`}
                            />
                          ))}
                        </RadioGroup>
                      </div>
                    );
                  })}
                </FormControl>
              )}
            </div>
          )}
        {room &&
          !this.state.started && <button onClick={this.start}>Start</button>}
        Users:
        {this.state.users.map(user => (
          <div>
            <p>Name: {user.name}</p>
            <p>Ready: {user.ready ? 'Yes' : 'No'}</p>
            <p>Finished: {user.finished ? 'Yes' : 'No'}</p>
          </div>
        ))}
        {!room && <p>...Loading</p>}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    room: state.rooms.find(room => room._id === ownProps.match.params.roomId),
    user: {
      ...state.auth,
    },
  };
}

export default connect(mapStateToProps, {
  getRooms,
  saveToLocal,
  enterRoom,
  leaveRoom,
  start,
  finish,
})(Room);
