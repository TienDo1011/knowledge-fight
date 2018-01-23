const initialState = {
  token: '',
  email: '',
  name: ''
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}