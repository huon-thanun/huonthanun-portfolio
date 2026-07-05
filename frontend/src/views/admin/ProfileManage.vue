<template>
  <div>
    <header class="page-head">
      <p class="eyebrow">about me</p>
      <h1 class="page-title">Profile</h1>
      <p class="page-sub">This information appears on your public portfolio's hero and about section.</p>
    </header>

    <form class="card form-card" @submit.prevent="save">
      <div class="form-row">
        <div class="field">
          <label>Full name</label>
          <input v-model="form.full_name" type="text" required />
        </div>
        <div class="field">
          <label>Title</label>
          <input v-model="form.title" type="text" placeholder="Junior Full-Stack Developer" />
        </div>
      </div>

      <div class="field">
        <label>Tagline</label>
        <input v-model="form.tagline" type="text" placeholder="One short sentence about what you do" />
      </div>

      <div class="field">
        <label>About text</label>
        <textarea v-model="form.about_text" rows="5"></textarea>
      </div>

      <div class="form-row">
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" />
        </div>
        <div class="field">
          <label>Phone</label>
          <input v-model="form.phone" type="text" />
        </div>
      </div>

      <div class="field">
        <label>Location</label>
        <input v-model="form.location" type="text" />
      </div>

      <div class="field">
        <label>Avatar image</label>
        <ImageUploader v-model="form.avatar_url" />
      </div>

      <div class="form-row">
        <div class="field">
          <label>GitHub URL</label>
          <input v-model="form.github_url" type="url" />
        </div>
        <div class="field">
          <label>LinkedIn URL</label>
          <input v-model="form.linkedin_url" type="url" />
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label>Facebook URL</label>
          <input v-model="form.facebook_url" type="url" />
        </div>
        <div class="field">
          <label>Resume URL</label>
          <input v-model="form.resume_url" type="url" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'saving…' : 'save changes' }}
      </button>
      <p v-if="saved" class="helper-success">Profile updated successfully.</p>
      <p v-if="error" class="helper-error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import ImageUploader from '../../components/ImageUploader.vue'
import profileService from '../../services/profileService'

const form = reactive({
  full_name: '', title: '', tagline: '', about_text: '', email: '', phone: '',
  location: '', avatar_url: '', resume_url: '', github_url: '', linkedin_url: '', facebook_url: ''
})
const saving = ref(false)
const saved = ref(false)
const error = ref('')

async function load() {
  try {
    const { data } = await profileService.get()
    Object.assign(form, data)
  } catch (err) {
    console.error(err)
  }
}

async function save() {
  saving.value = true
  saved.value = false
  error.value = ''
  try {
    await profileService.update(form)
    saved.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save profile.'
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.page-head { margin-bottom: var(--space-7); }
.page-title { font-size: 1.8rem; margin-top: var(--space-2); }
.page-sub { color: var(--text-dim); margin-top: var(--space-2); }
.form-card { padding: var(--space-6); max-width: 720px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
@media (max-width: 700px) { .form-row { grid-template-columns: 1fr; } }
</style>
