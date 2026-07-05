<template>
  <div>
    <header class="page-head">
      <div>
        <p class="eyebrow">portfolio content</p>
        <h1 class="page-title">Skills</h1>
        <p class="page-sub">Manage the skills shown in your "Skills" section.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">+ add skill</button>
    </header>

    <form v-if="showForm" class="card form-card" @submit.prevent="save">
      <h2 class="form-card__title">{{ editingId ? 'Edit skill' : 'New skill' }}</h2>
      <div class="form-row">
        <div class="field">
          <label>Name</label>
          <input v-model="form.name" type="text" required />
        </div>
        <div class="field">
          <label>Category</label>
          <input v-model="form.category" type="text" placeholder="Frontend / Backend / Tools" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label>Proficiency ({{ form.proficiency }}%)</label>
          <input v-model.number="form.proficiency" type="range" min="0" max="100" />
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
      <div v-for="s in skills" :key="s.id" class="list-item card">
        <div class="list-item__body">
          <h3>{{ s.name }}</h3>
          <p class="list-item__meta mono">{{ s.category }} · {{ s.proficiency }}%</p>
        </div>
        <div class="list-item__actions">
          <button class="btn btn-sm" @click="openEdit(s)">edit</button>
          <button class="btn btn-sm btn-danger" @click="remove(s.id)">delete</button>
        </div>
      </div>
      <p v-if="!skills.length" class="empty-note">No skills yet. Click "add skill" to create one.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import skillService from '../../services/skillService'

const skills = ref([])
const showForm = ref(false)
const editingId = ref(null)
const saving = ref(false)
const error = ref('')

const emptyForm = () => ({ name: '', category: 'Frontend', proficiency: 50, icon_class: '', display_order: 0 })
const form = reactive(emptyForm())

async function load() {
  const { data } = await skillService.getAll()
  skills.value = data
}

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  showForm.value = true
  error.value = ''
}

function openEdit(s) {
  Object.assign(form, s)
  editingId.value = s.id
  showForm.value = true
  error.value = ''
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (editingId.value) await skillService.update(editingId.value, form)
    else await skillService.create(form)
    showForm.value = false
    await load()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save skill.'
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this skill?')) return
  await skillService.remove(id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.page-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-7); gap: var(--space-4); flex-wrap: wrap; }
.page-title { font-size: 1.8rem; margin-top: var(--space-2); }
.page-sub { color: var(--text-dim); margin-top: var(--space-2); }
.form-card { padding: var(--space-6); margin-bottom: var(--space-6); max-width: 640px; }
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
