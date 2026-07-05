<template>
  <div>
    <header class="page-head">
      <p class="eyebrow">account</p>
      <h1 class="page-title">Settings</h1>
      <p class="page-sub">Update your admin login password.</p>
    </header>

    <form class="card form-card" @submit.prevent="submit" novalidate>
      <BaseInput v-model="currentPassword" label="Current password" type="password" required :error="errors.current" />
      <BaseInput v-model="newPassword" label="New password" type="password" required :error="errors.next" />
      <BaseInput v-model="confirmPassword" label="Confirm new password" type="password" required
        :error="errors.confirm" />
      <BaseButton type="submit" variant="primary" :loading="saving" loading-text="updating…" label="update password" />
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import authService from '../../services/authService'
import { useToastStore } from '../../stores/toastStore'
import { minLength } from '../../utils/validators'

const toast = useToastStore()

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

.form-card {
  padding: var(--space-6);
  max-width: 420px;
}
</style>
