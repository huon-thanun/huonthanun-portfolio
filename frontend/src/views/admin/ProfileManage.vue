<template>
  <div>
    <header class="page-head">
      <div>
        <p class="eyebrow">about me</p>
        <h1 class="page-title">Profile</h1>
        <p class="page-sub">This information appears on your public portfolio's hero and about section.</p>
      </div>
      <BaseButton variant="primary" label="edit profile" @click="openEdit" />
    </header>

    <!-- ============ READ-ONLY VIEW ============ -->
    <div class="card view-card">
      <div class="view-card__top">
        <div v-if="profile.avatar_url" class="view-card__avatar">
          <img :src="profile.avatar_url" :alt="profile.full_name" />
        </div>
        <div>
          <h2 class="view-card__name">{{ profile.full_name || '—' }}</h2>
          <p class="view-card__title mono">{{ profile.title || '—' }}</p>
        </div>
      </div>

      <p v-if="profile.tagline" class="view-card__tagline">{{ profile.tagline }}</p>
      <p class="view-card__about">{{ profile.about_text || 'No about text set yet.' }}</p>

      <dl class="view-card__meta">
        <div>
          <dt>Email</dt>
          <dd>{{ profile.email || '—' }}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{{ profile.phone || '—' }}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{{ profile.location || '—' }}</dd>
        </div>
        <div>
          <dt>GitHub</dt>
          <dd>{{ profile.github_url || '—' }}</dd>
        </div>
        <div>
          <dt>LinkedIn</dt>
          <dd>{{ profile.linkedin_url || '—' }}</dd>
        </div>
        <div>
          <dt>Facebook</dt>
          <dd>{{ profile.facebook_url || '—' }}</dd>
        </div>
        <div>
          <dt>Resume</dt>
          <dd>{{ profile.resume_url || '—' }}</dd>
        </div>
      </dl>
    </div>

    <!-- ============ EDIT MODAL ============ -->
    <BaseModal v-model="showForm" title="Edit profile" size="lg">
      <form id="profile-form" @submit.prevent="save" novalidate>
        <div class="form-row">
          <BaseInput v-model="form.full_name" label="Full name" required :error="errors.full_name" />
          <BaseInput v-model="form.title" label="Title" placeholder="Junior Full-Stack Developer" />
        </div>
        <BaseInput v-model="form.tagline" label="Tagline" placeholder="One short sentence about what you do" />
        <BaseTextarea v-model="form.about_text" label="About text" :rows="5" />
        <div class="form-row">
          <BaseInput v-model="form.email" label="Email" type="email" :error="errors.email" />
          <BaseInput v-model="form.phone" label="Phone" />
        </div>
        <BaseInput v-model="form.location" label="Location" />
        <div class="field">
          <label>Avatar image</label>
          <ImageUploader v-model="form.avatar_url" />
        </div>
        <div class="form-row">
          <BaseInput v-model="form.github_url" label="GitHub URL" type="url" :error="errors.github_url" />
          <BaseInput v-model="form.linkedin_url" label="LinkedIn URL" type="url" :error="errors.linkedin_url" />
        </div>
        <div class="form-row">
          <BaseInput v-model="form.facebook_url" label="Facebook URL" type="url" :error="errors.facebook_url" />
          <BaseInput v-model="form.resume_url" label="Resume URL" type="url" :error="errors.resume_url" />
        </div>
      </form>
      <template #footer>
        <BaseButton type="submit" form="profile-form" variant="primary" :loading="saving" label="save changes" />
        <BaseButton label="cancel" @click="showForm = false" />
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import ImageUploader from '../../components/ImageUploader.vue'
import profileService from '../../services/profileService'
import { useToastStore } from '../../stores/toastStore'
import { validate, isRequired, isEmail, isUrl } from '../../utils/validators'

const toast = useToastStore()

const profile = ref({})
const showForm = ref(false)
const saving = ref(false)
const errors = reactive({})

const emptyForm = () => ({
  full_name: '', title: '', tagline: '', about_text: '', email: '', phone: '',
  location: '', avatar_url: '', resume_url: '', github_url: '', linkedin_url: '', facebook_url: ''
})
const form = reactive(emptyForm())

async function load() {
  try {
    const { data } = await profileService.get()
    profile.value = data || {}
  } catch (err) {
    console.error(err)
  }
}

function openEdit() {
  Object.assign(form, emptyForm(), profile.value)
  clearErrors()
  showForm.value = true
}

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

function validateForm() {
  const result = validate(form, {
    full_name: [[isRequired, 'Full name is required.']],
    email: [[(v) => !v || isEmail(v), 'Please enter a valid email address.']],
    github_url: [[isUrl, 'Please enter a valid URL.']],
    linkedin_url: [[isUrl, 'Please enter a valid URL.']],
    facebook_url: [[isUrl, 'Please enter a valid URL.']],
    resume_url: [[isUrl, 'Please enter a valid URL.']]
  })
  clearErrors()
  Object.assign(errors, result)
  return Object.keys(result).length === 0
}

async function save() {
  if (!validateForm()) return
  saving.value = true
  try {
    const { data } = await profileService.update(form)
    profile.value = data
    toast.success('Profile updated successfully.')
    showForm.value = false
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save profile.')
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-7);
  gap: var(--space-4);
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.8rem;
  margin-top: var(--space-2);
}

.page-sub {
  color: var(--text-dim);
  margin-top: var(--space-2);
  max-width: 480px;
}

.view-card {
  padding: var(--space-6);
  max-width: 720px;
}

.view-card__top {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.view-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.view-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-card__name {
  font-size: 1.3rem;
}

.view-card__title {
  color: var(--accent);
  font-size: 0.85rem;
  margin-top: var(--space-1);
}

.view-card__tagline {
  color: var(--text);
  font-size: 1rem;
  margin-bottom: var(--space-4);
}

.view-card__about {
  color: var(--text-dim);
  line-height: 1.6;
  margin-bottom: var(--space-6);
  white-space: pre-wrap;
}

.view-card__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.view-card__meta>div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  border-top: 1px solid var(--border);
  padding-top: var(--space-3);
}

.view-card__meta dt {
  color: var(--text-faint);
  font-size: 0.78rem;
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.view-card__meta dd {
  margin: 0;
  font-size: 0.88rem;
  text-align: right;
  word-break: break-all;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

@media (max-width: 700px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
