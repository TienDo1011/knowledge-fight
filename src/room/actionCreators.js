export function getRooms() {
  return {
    type: 'GET_ROOMS'
  }
}

export function saveToLocal(userAnswers) {
  return {
    type: 'SAVE_TO_LOCAL',
    payload: {
      userAnswers
    }
  }
}

export function enterRoom(payload) {
  return {
    type: 'ENTER_ROOM',
    payload
  }
}

export function leaveRoom(payload) {
  return {
    type: 'LEAVE_ROOM',
    payload
  }
}

export function start(payload) {
  return {
    type: 'START',
    payload
  }
}

export function finish(payload) {
  return {
    type: 'FINISH',
    payload
  }
}