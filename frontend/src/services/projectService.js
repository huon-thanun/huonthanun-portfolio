import http from './http'

export default {
  getAll() { return http.get('/projects') },
  getOne(id) { return http.get(`/projects/${id}`) },
  create(data) { return http.post('/projects', data) },
  update(id, data) { return http.put(`/projects/${id}`, data) },
  remove(id) { return http.delete(`/projects/${id}`) }
}
