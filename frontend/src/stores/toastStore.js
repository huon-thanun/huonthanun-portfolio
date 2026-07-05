import { defineStore } from 'pinia'

let nextId = 1

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] // { id, type: 'success' | 'error' | 'info', message }
  }),

  actions: {
    push(type, message, duration = 4000) {
      const id = nextId++
      this.toasts.push({ id, type, message })
      setTimeout(() => this.remove(id), duration)
      return id
    },
    success(message, duration) {
      return this.push('success', message, duration)
    },
    error(message, duration) {
      return this.push('error', message, duration)
    },
    info(message, duration) {
      return this.push('info', message, duration)
    },
    remove(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    }
  }
})
