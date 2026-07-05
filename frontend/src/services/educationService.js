import http from './http'

export default {
  getAll() { return http.get('/education') },
  getOne(id) { return http.get(`/education/${id}`) },
  create(data) { return http.post('/education', data) },
  update(id, data) { return http.put(`/education/${id}`, data) },
  remove(id) { return http.delete(`/education/${id}`) }
}
