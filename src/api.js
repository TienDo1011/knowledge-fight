import axios from 'axios';

import config from './config.json';

class Api {
  getRooms() {
    return axios.get(`${config.server_url}`);
  }

  login(payload) {
    return axios.post(`${config.server_url}/auth/sign-in`, payload)
  }

  register(payload) {
    return axios.post(`${config.server_url}/auth/register`, payload)
  }

  enterRoom(payload) {
    return axios.post(`${config.server_url}/enter-room`, payload)
  }

  leaveRoom(payload) {
    return axios.post(`${config.server_url}/leave-room`, payload)
  }

  start(payload) {
    return axios.post(`${config.server_url}/start`, payload)
  }

  finish(payload) {
    return axios.post(`${config.server_url}/finish`, payload)
  }
}

export default Api