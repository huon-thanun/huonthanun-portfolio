import http from './http'

export default {
  upload(file) {
    const formData = new FormData()
    formData.append('image', file)
    return http.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
