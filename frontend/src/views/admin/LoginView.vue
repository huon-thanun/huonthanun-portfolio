<template>
  <div class="login">
    <form class="login__card card" @submit.prevent="submit">
      <p class="eyebrow">admin access</p>
      <h1 class="login__title">Sign in to dashboard</h1>

      <div class="field">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required autocomplete="username" />
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" required autocomplete="current-password" />
      </div>

      <button type="submit" class="btn btn-primary login__submit" :disabled="loading">
        {{ loading ? 'signing in…' : 'sign in' }}
      </button>
      <p v-if="error" class="helper-error">{{ error }}</p>

      <router-link to="/" class="login__back mono">← back to site</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push(route.query.redirect || '/admin/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: var(--space-5);
}

.login__card {
  width: 100%;
  max-width: 380px;
  padding: var(--space-7) var(--space-6);
}

.login__title {
  font-size: 1.5rem;
  margin: var(--space-3) 0 var(--space-6);
}

.login__submit {
  width: 100%;
  margin-top: var(--space-2);
}

.login__back {
  display: block;
  text-align: center;
  margin-top: var(--space-6);
  color: var(--text-dim);
  font-size: 0.82rem;
}
.login__back:hover { color: var(--accent); }
</style>
