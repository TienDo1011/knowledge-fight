import { all, call, takeEvery, put } from 'redux-saga/effects';
import { GET_ROOMS, GET_ROOMS_SUCCESS, SAVE_TO_LOCAL } from './room/actionTypes';
import Api from './api';

function* getRooms() {
  const { data } = yield call(new Api().getRooms);
  yield put({
    type: GET_ROOMS_SUCCESS,
    rooms: data.rooms
  })
}

function* watchGetRooms() {
  yield takeEvery(GET_ROOMS, getRooms())
}

function* saveToLocal(action) {
  yield localStorage.setItem('userAnswers', JSON.stringify(action.payload.userAnswers));
}

function* watchSaveToLocal() {
  yield takeEvery(SAVE_TO_LOCAL, saveToLocal)
}

function* login(action) {
  const { data } = yield call(new Api().login, action.payload.credential);
  yield put({
    type: 'LOGIN_SUCCESS',
    payload: data
  })
  action.payload.callbackSuccess();
}

function* watchLogin() {
  yield takeEvery('LOGIN', login)
}

function* register(action) {
  const { data } = yield call(new Api().register, action.payload.credential);
  yield put({
    type: 'REGISTER_SUCCESS',
    payload: data
  })
  action.payload.callbackSuccess();
}

function* watchRegister() {
  yield takeEvery('REGISTER', register)
}

function* enterRoom(action) {
  try {
    yield call(new Api().enterRoom, action.payload);
  } catch (err) {
    console.log('err', err);
  }
}

function* watchEnterRoom() {
  yield takeEvery('ENTER_ROOM', enterRoom)
}

function* leaveRoom(action) {
  yield call(new Api().leaveRoom, action.payload);
}

function* watchLeaveRoom() {
  yield takeEvery('LEAVE_ROOM', leaveRoom)
}

function* start(action) {
  yield call(new Api().start, action.payload);
}

function* watchStart() {
  yield takeEvery('START', start)
}

function* finish(action) {
  const answers = JSON.parse(localStorage.getItem('userAnswers'));
  yield call(new Api().finish, {
    answers,
    ...action.payload
  });
}

function* watchFinish() {
  yield takeEvery('FINISH', finish)
}

export default function* rootSaga() {
  yield all([
    getRooms(),
    watchSaveToLocal(),
    watchLogin(),
    watchRegister(),
    watchEnterRoom(),
    watchLeaveRoom(),
    watchStart(),
    watchFinish()
  ])
}