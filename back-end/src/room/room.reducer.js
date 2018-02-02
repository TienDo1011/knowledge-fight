import { GET_ROOMS_SUCCESS } from "./actionTypes";

const initialState = []

export default function roomReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ROOMS_SUCCESS:
      return action.rooms;
    default:
      return state;
  }
}