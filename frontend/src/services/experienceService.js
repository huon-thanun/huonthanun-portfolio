import http from './http'

export default {
  getAll() { return http.get('/experience') },
  getOne(id) { return http.get(`/experience/${id}`) },
  create(data) { return http.post('/experience', data) },
  update(id, data) { return http.put(`/experience/${id}`, data) },
  remove(id) { return http.delete(`/experience/${id}`) }
}
