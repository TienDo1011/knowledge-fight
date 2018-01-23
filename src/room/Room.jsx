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

class Room extends Component {
  state = {
    started: false,
    finished: false
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
    this.setState({
      finished: true
    })
    finish({
      roomId: room._id,
      email: user.email,
    });
  };

  componentDidMount() {
    const { room, user } = this.props;
    const socket = io('http://localhost:3001');
    if (!room) {
      this.props.getRooms();
    }
    if (room) {
      socket.on(`${room._id}:started`, () => {
        this.setState({
          started: true
        })
      });
      socket.on(`${room._id}:finished`, function (data) {
        console.log(data)
      });
      this.props.enterRoom({
        roomId: room._id,
        name: user.name,
        email: user.email,
        ready: false,
        finished: false,
        answers: [],
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
      leaveRoom({
        roomId: room._id,
        email: user.email,
      });
    }
  }

  render() {
    const { room } = this.props;
    if (room) {
      if (this.state.started) {
        return <div>
              <button onClick={this.finish}>Finish</button>
              {
                this.state.finished ? 
                  ''
                :
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
              }
            </div>
      } else {
        return <button onClick={this.start}>Start</button>
      }
    }
    return <p>...Loading</p>;
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
