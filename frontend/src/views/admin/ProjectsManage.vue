<template>
  <div>
    <header class="page-head">
      <div>
        <p class="eyebrow">portfolio content</p>
        <h1 class="page-title">Projects</h1>
        <p class="page-sub">Manage the projects shown in your "Work" section.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ add project</button>
    </header>

    <form v-if="showForm" class="card form-card" @submit.prevent="save">
      <h2 class="form-card__title">{{ editingId ? 'Edit project' : 'New project' }}</h2>

      <div class="field">
        <label>Title</label>
        <input v-model="form.title" type="text" required />
      </div>
      <div class="field">
        <label>Description</label>
        <textarea v-model="form.description" rows="3"></textarea>
      </div>
      <div class="field">
        <label>Image</label>
        <ImageUploader v-model="form.image_url" />
      </div>
      <div class="field">
        <label>Tech stack (comma separated)</label>
        <input v-model="form.tech_stack" type="text" placeholder="Vue3, Node.js, MySQL" />
      </div>
      <div class="form-row">
        <div class="field">
          <label>Demo URL</label>
          <input v-model="form.demo_url" type="url" />
        </div>
        <div class="field">
          <label>Repo URL</label>
          <input v-model="form.repo_url" type="url" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Display order</label>
          <input v-model.number="form.display_order" type="number" />
        </div>
        <div class="field field--checkbox">
          <label>
            <input v-model="form.featured" type="checkbox" style="width:auto" />
            Featured project
          </label>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'saving…' : 'save' }}</button>
        <button type="button" class="btn" @click="closeForm">cancel</button>
      </div>
      <p v-if="error" class="helper-error">{{ error }}</p>
    </form>

    <div class="list">
      <div v-for="p in projects" :key="p.id" class="list-item card">
        <div class="list-item__thumb" v-if="p.image_url"><img :src="p.image_url" /></div>
        <div class="list-item__body">
          <h3>{{ p.title }}</h3>
          <p class="list-item__meta mono">{{ p.tech_stack }}</p>
        </div>
        <div class="list-item__actions">
          <button class="btn btn-sm" @click="openEdit(p)">edit</button>
          <button class="btn btn-sm btn-danger" @click="remove(p.id)">delete</button>
        </div>
      </div>
      <p v-if="!projects.length" class="empty-note">No projects yet. Click "add project" to create one.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import ImageUploader from '../../components/ImageUploader.vue'
import projectService from '../../services/projectService'

const projects = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const error = ref('')

const emptyForm = () => ({
  title: '', description: '', image_url: '', tech_stack: '', demo_url: '', repo_url: '', featured: false, display_order: 0
})
const form = reactive(emptyForm())

async function load() {
  const { data } = await projectService.getAll()
  projects.value = data
}

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  showForm.value = true
  error.value = ''
}

function openEdit(p) {
  Object.assign(form, p, { featured: !!p.featured })
  editingId.value = p.id
  showForm.value = true
  error.value = ''
}

function closeForm() {
  showForm.value = false
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (editingId.value) {
      await projectService.update(editingId.value, form)
    } else {
      await projectService.create(form)
    }
    showForm.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save project.'
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return
  await projectService.remove(id)
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
.field--checkbox { display: flex; align-items: flex-end; }
.field--checkbox label { display: flex; align-items: center; gap: var(--space-2); text-transform: none; font-family: var(--font-body); color: var(--text); }
.form-actions { display: flex; gap: var(--space-3); margin-top: var(--space-3); }

.list { display: flex; flex-direction: column; gap: var(--space-3); }
.list-item { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4); }
.list-item__thumb { width: 56px; height: 56px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; }
.list-item__thumb img { width: 100%; height: 100%; object-fit: cover; }
.list-item__body { flex: 1; }
.list-item__body h3 { font-size: 1rem; }
.list-item__meta { color: var(--text-faint); font-size: 0.78rem; margin-top: var(--space-1); }
.list-item__actions { display: flex; gap: var(--space-2); }

.empty-note { color: var(--text-faint); font-family: var(--font-mono); font-size: 0.85rem; padding: var(--space-5); }

@media (max-width: 700px) { .form-row { grid-template-columns: 1fr; } }
</style>
