<template>
  <div>
    <header class="page-head">
      <div>
        <p class="eyebrow">portfolio content</p>
        <h1 class="page-title">Experience</h1>
        <p class="page-sub">Manage your work history timeline.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ add experience</button>
    </header>

    <form v-if="showForm" class="card form-card" @submit.prevent="save">
      <h2 class="form-card__title">{{ editingId ? 'Edit experience' : 'New experience' }}</h2>
      <div class="form-row">
        <div class="field">
          <label>Company</label>
          <input v-model="form.company" type="text" required />
        </div>
        <div class="field">
          <label>Position</label>
          <input v-model="form.position" type="text" required />
        </div>
      </div>
      <div class="field">
        <label>Description</label>
        <textarea v-model="form.description" rows="3"></textarea>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Start date</label>
          <input v-model="form.start_date" type="date" />
        </div>
        <div class="field">
          <label>End date (leave blank if current)</label>
          <input v-model="form.end_date" type="date" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Location</label>
          <input v-model="form.location" type="text" />
        </div>
        <div class="field">
          <label>Display order</label>
          <input v-model.number="form.display_order" type="number" />
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'saving…' : 'save' }}</button>
        <button type="button" class="btn" @click="showForm = false">cancel</button>
      </div>
      <p v-if="error" class="helper-error">{{ error }}</p>
    </form>

    <div class="list">
      <div v-for="e in experience" :key="e.id" class="list-item card">
        <div class="list-item__body">
          <h3>{{ e.position }} · {{ e.company }}</h3>
          <p class="list-item__meta mono">{{ e.start_date?.slice(0,10) }} — {{ e.end_date ? e.end_date.slice(0,10) : 'Present' }}</p>
        </div>
        <div class="list-item__actions">
          <button class="btn btn-sm" @click="openEdit(e)">edit</button>
          <button class="btn btn-sm btn-danger" @click="remove(e.id)">delete</button>
        </div>
      </div>
      <p v-if="!experience.length" class="empty-note">No experience entries yet.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import experienceService from '../../services/experienceService'

const experience = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const error = ref('')

const emptyForm = () => ({ company: '', position: '', description: '', start_date: '', end_date: '', location: '', display_order: 0 })
const form = reactive(emptyForm())

async function load() {
  const { data } = await experienceService.getAll()
  experience.value = data
}

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  showForm.value = true
  error.value = ''
}

function openEdit(e) {
  Object.assign(form, e, {
    start_date: e.start_date ? e.start_date.slice(0, 10) : '',
    end_date: e.end_date ? e.end_date.slice(0, 10) : ''
  })
  editingId.value = e.id
  showForm.value = true
  error.value = ''
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const payload = { ...form, end_date: form.end_date || null }
    if (editingId.value) await experienceService.update(editingId.value, payload)
    else await experienceService.create(payload)
    showForm.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save experience.'
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this experience entry?')) return
  await experienceService.remove(id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.page-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-7); gap: var(--space-4); flex-wrap: wrap; }
.page-title { font-size: 1.8rem; margin-top: var(--space-2); }
.page-sub { color: var(--text-dim); margin-top: var(--space-2); }
.form-card { padding: var(--space-6); margin-bottom: var(--space-6); max-width: 720px; }
.form-card__title { font-size: 1.1rem; margin-bottom: var(--space-5); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.form-actions { display: flex; gap: var(--space-3); margin-top: var(--space-3); }
.list { display: flex; flex-direction: column; gap: var(--space-3); }
.list-item { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); }
.list-item__body { flex: 1; }
.list-item__body h3 { font-size: 1rem; }
.list-item__meta { color: var(--text-faint); font-size: 0.78rem; margin-top: var(--space-1); }
.list-item__actions { display: flex; gap: var(--space-2); }
.empty-note { color: var(--text-faint); font-family: var(--font-mono); font-size: 0.85rem; padding: var(--space-5); }
@media (max-width: 700px) { .form-row { grid-template-columns: 1fr; } }
</style>
