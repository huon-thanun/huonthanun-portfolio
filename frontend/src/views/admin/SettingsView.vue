<template>
  <div>
    <header class="page-head">
      <p class="eyebrow">account</p>
      <h1 class="page-title">Settings</h1>
      <p class="page-sub">Manage your admin account security.</p>
    </header>

    <div class="settings-grid">
      <div class="card settings-info">
        <div class="settings-info__icon">🔒</div>
        <h2 class="settings-info__title">Account security</h2>
        <p class="settings-info__text">
          Your password protects access to the dashboard where all of your portfolio
          content — profile, projects, skills, and messages — is managed.
        </p>
        <ul class="settings-info__tips">
          <li>Use at least 6 characters</li>
          <li>Mix letters, numbers, and symbols</li>
          <li>Avoid reusing passwords from other sites</li>
        </ul>
        <div class="settings-info__account" v-if="auth.user">
          <p class="settings-info__label mono">signed in as</p>
          <p class="settings-info__email">{{ auth.user.email }}</p>
        </div>
      </div>

      <form class="card settings-form" @submit.prevent="submit" novalidate>
        <h2 class="settings-form__title">Change password</h2>
        <BaseInput v-model="currentPassword" label="Current password" type="password" required
          :error="errors.current" />
        <BaseInput v-model="newPassword" label="New password" type="password" required :error="errors.next" />
        <BaseInput v-model="confirmPassword" label="Confirm new password" type="password" required
          :error="errors.confirm" />
        <BaseButton type="submit" variant="primary" :loading="saving" loading-text="updating…"
          label="update password" />
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import authService from '../../services/authService'
import { useAuthStore } from '../../stores/authStore'
import { useToastStore } from '../../stores/toastStore'
import { minLength } from '../../utils/validators'

const toast = useToastStore()
const auth = useAuthStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const errors = reactive({})

function validateForm() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!currentPassword.value) errors.current = 'Please enter your current password.'
  if (!minLength(newPassword.value, 6)) errors.next = 'New password must be at least 6 characters.'
  if (confirmPassword.value !== newPassword.value) errors.confirm = 'Passwords do not match.'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validateForm()) return
  saving.value = true
  try {
    await authService.changePassword({ currentPassword: currentPassword.value, newPassword: newPassword.value })
    toast.success('Password updated successfully.')
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update password.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-head {
  margin-bottom: var(--space-7);
}

.page-title {
  font-size: 1.8rem;
  margin-top: var(--space-2);
}

.page-sub {
  color: var(--text-dim);
  margin-top: var(--space-2);
}

.settings-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--space-5);
  align-items: start;
  max-width: 900px;
}

.settings-grid > * {
  min-width: 0;
}

.settings-info {
  padding: var(--space-6);
  background: linear-gradient(180deg, var(--accent-soft), transparent 70%), var(--bg-elev);
}

.settings-info__icon {
  font-size: 1.8rem;
  margin-bottom: var(--space-4);
}

.settings-info__title {
  font-size: 1.1rem;
  margin-bottom: var(--space-3);
}

.settings-info__text {
  color: var(--text-dim);
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: var(--space-5);
}

.settings-info__tips {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.settings-info__tips li {
  position: relative;
  padding-left: var(--space-5);
  color: var(--text-dim);
  font-size: 0.85rem;
}

.settings-info__tips li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-family: var(--font-mono);
}

.settings-info__account {
  border-top: 1px solid var(--border);
  padding-top: var(--space-5);
}

.settings-info__label {
  color: var(--text-faint);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.settings-info__email {
  font-size: 0.9rem;
  word-break: break-all;
}

.settings-form {
  padding: var(--space-7) var(--space-6);
}

.settings-form__title {
  font-size: 1.1rem;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--border);
}

@media (max-width: 760px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>
