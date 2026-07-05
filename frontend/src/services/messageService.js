import http from './http'

export default {
  send(data) { return http.post('/messages', data) },
  getAll() { return http.get('/messages') },
  markRead(id) { return http.patch(`/messages/${id}/read`) },
  remove(id) { return http.delete(`/messages/${id}`) }
}
