import http from './http'

export default {
  getAll() { return http.get('/skills') },
  getOne(id) { return http.get(`/skills/${id}`) },
  create(data) { return http.post('/skills', data) },
  update(id, data) { return http.put(`/skills/${id}`, data) },
  remove(id) { return http.delete(`/skills/${id}`) }
}
