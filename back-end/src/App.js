import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography'
import logo from './logo.svg';
import './App.css';

import { getRooms } from './room/actionCreators';
import Room from './room/Room';

class App extends Component {
  componentWillMount() {
    const { history: { push }, token } = this.props;
    if (!token) {
      push('/sign-in');
    }
  }

  componentDidMount() {
    this.props.getRooms();
  }

  render() {
    const { roomIds, match } = this.props;
    return (
      <Grid container>
        <Grid item xs={4}>
          {
            roomIds.map(roomId =>
              <Link to={`/${roomId}`} key={roomId}>
                <Card>
                  <CardContent>
                    <Typography component="p">
                      { roomId }
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            )
          }
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    roomIds: state.rooms.map(room => room._id),
    token: state.auth.token
  }
}

export default connect(mapStateToProps, { getRooms })(App);
