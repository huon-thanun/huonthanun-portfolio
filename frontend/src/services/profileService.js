import http from './http'

export default {
  get() { return http.get('/profile') },
  update(data) { return http.put('/profile', data) },
  getStats() { return http.get('/dashboard/stats') }
}
