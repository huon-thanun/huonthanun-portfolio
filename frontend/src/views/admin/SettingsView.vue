<template>
  <div>
    <header class="page-head">
      <p class="eyebrow">account</p>
      <h1 class="page-title">Settings</h1>
      <p class="page-sub">Update your admin login password.</p>
    </header>

    <form class="card form-card" @submit.prevent="submit">
      <div class="field">
        <label>Current password</label>
        <input v-model="currentPassword" type="password" required />
      </div>
      <div class="field">
        <label>New password</label>
        <input v-model="newPassword" type="password" required minlength="6" />
      </div>
      <div class="field">
        <label>Confirm new password</label>
        <input v-model="confirmPassword" type="password" required minlength="6" />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'updating…' : 'update password' }}</button>
      <p v-if="success" class="helper-success">Password updated successfully.</p>
      <p v-if="error" class="helper-error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import authService from '../../services/authService'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const success = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  success.value = false
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'New password and confirmation do not match.'
    return
  }
  saving.value = true
  try {
    await authService.changePassword({ currentPassword: currentPassword.value, newPassword: newPassword.value })
    success.value = true
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update password.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-head { margin-bottom: var(--space-7); }
.page-title { font-size: 1.8rem; margin-top: var(--space-2); }
.page-sub { color: var(--text-dim); margin-top: var(--space-2); }
.form-card { padding: var(--space-6); max-width: 420px; }
</style>
