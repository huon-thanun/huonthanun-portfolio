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
    <div class="profile-grid">
      <div class="card profile-side">
        <div class="profile-side__avatar" v-if="profile.avatar_url">
          <img :src="profile.avatar_url" :alt="profile.full_name" @error="onImageError" />
        </div>
        <div v-else class="profile-side__avatar profile-side__avatar--empty">
          {{ initials }}
        </div>
        <h2 class="profile-side__name">{{ profile.full_name || '—' }}</h2>
        <p class="profile-side__title mono">{{ profile.title || '—' }}</p>
        <p v-if="profile.tagline" class="profile-side__tagline">{{ profile.tagline }}</p>

        <div class="profile-side__links">
          <a v-if="profile.github_url" :href="profile.github_url" target="_blank" class="badge">GitHub</a>
          <a v-if="profile.linkedin_url" :href="profile.linkedin_url" target="_blank" class="badge">LinkedIn</a>
          <a v-if="profile.facebook_url" :href="profile.facebook_url" target="_blank" class="badge">Facebook</a>
          <a v-if="profile.resume_url" :href="profile.resume_url" target="_blank" class="badge">Resume</a>
        </div>
      </div>

      <div class="card profile-main">
        <section class="profile-section">
          <p class="profile-section__label mono">about</p>
          <p class="profile-section__about">{{ profile.about_text || 'No about text set yet.' }}</p>
        </section>

        <section class="profile-section">
          <p class="profile-section__label mono">contact information</p>
          <div class="profile-info-grid">
            <div class="info-tile">
              <p class="info-tile__label mono">email</p>
              <p class="info-tile__value">{{ profile.email || '—' }}</p>
            </div>
            <div class="info-tile">
              <p class="info-tile__label mono">phone</p>
              <p class="info-tile__value">{{ profile.phone || '—' }}</p>
            </div>
            <div class="info-tile">
              <p class="info-tile__label mono">location</p>
              <p class="info-tile__value">{{ profile.location || '—' }}</p>
            </div>
          </div>
        </section>
      </div>
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
import { reactive, ref, computed, onMounted } from 'vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import ImageUploader from '../../components/ImageUploader.vue'
import profileService from '../../services/profileService'
import { useToastStore } from '../../stores/toastStore'
import { validate, isRequired, isEmail, isUrl } from '../../utils/validators'
import { onImageError } from '../../utils/imageFallback'

const toast = useToastStore()

const profile = ref({})
const showForm = ref(false)
const saving = ref(false)
const errors = reactive({})

const initials = computed(() => {
  const name = profile.value.full_name || ''
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?'
})

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

.profile-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-5);
  align-items: start;
}

.profile-side {
  padding: var(--space-7) var(--space-6);
  text-align: center;
  background: linear-gradient(180deg, var(--accent-soft), transparent 60%), var(--bg-elev);
}

.profile-side__avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto var(--space-5);
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 5px var(--accent-soft);
}

.profile-side__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-side__avatar--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--accent);
  background: var(--bg-elev-2);
}

.profile-side__name {
  font-size: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-side__title {
  color: var(--accent);
  font-size: 0.82rem;
  margin-top: var(--space-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-side__tagline {
  color: var(--text-dim);
  font-size: 0.9rem;
  margin-top: var(--space-4);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-side__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);
}

.profile-main {
  padding: var(--space-7) var(--space-6);
}

.profile-section+.profile-section {
  margin-top: var(--space-7);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border);
}

.profile-section__label {
  color: var(--accent);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-4);
}

.profile-section__about {
  color: var(--text);
  line-height: 1.7;
  white-space: pre-wrap;
  font-size: 0.98rem;
}

.profile-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.info-tile {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  min-width: 0; /* required for ellipsis to work inside CSS grid cell */
}

.info-tile__label {
  color: var(--text-faint);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
}

.info-tile__value {
  font-size: 0.92rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 860px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-info-grid {
    grid-template-columns: 1fr 1fr;
  }

  .profile-side {
    padding: var(--space-6) var(--space-5);
  }
}

@media (max-width: 500px) {
  .profile-info-grid {
    grid-template-columns: 1fr;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-row > * {
  min-width: 0;
}

@media (max-width: 700px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
