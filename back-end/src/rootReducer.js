import { combineReducers } from 'redux';
import roomReducer from './room/room.reducer';
import authReducer from './auth/auth.reducer';

export default combineReducers({
  rooms: roomReducer,
  auth: authReducer
})