import http from './http'

export default {
  login(credentials) {
    return http.post('/auth/login', credentials)
  },
  getMe() {
    return http.get('/auth/me')
  },
  changePassword(payload) {
    return http.put('/auth/change-password', payload)
  }
}
