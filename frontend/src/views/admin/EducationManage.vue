<template>
  <div>
    <header class="page-head">
      <div>
        <p class="eyebrow">portfolio content</p>
        <h1 class="page-title">Education</h1>
        <p class="page-sub">Manage your education timeline.</p>
      </div>
      <BaseButton variant="primary" label="+ add education" @click="openCreate" />
    </header>

    <div class="list">
      <div v-for="e in education" :key="e.id" class="list-item card">
        <div class="list-item__body">
          <h3>{{ e.degree }} · {{ e.school }}</h3>
          <p class="list-item__meta mono">{{ e.field_of_study }}</p>
        </div>
        <div class="list-item__actions">
          <BaseButton size="sm" label="view" @click="openView(e)" />
          <BaseButton size="sm" label="edit" @click="openEdit(e)" />
          <BaseButton size="sm" variant="danger" label="delete" @click="remove(e.id)" />
        </div>
      </div>
      <p v-if="!education.length" class="empty-note">No education entries yet.</p>
    </div>

    <BaseModal v-model="showForm" :title="editingId ? 'Edit education' : 'New education'">
      <form id="education-form" @submit.prevent="save" novalidate>
        <div class="form-row">
          <BaseInput v-model="form.school" label="School" required :error="errors.school" />
          <BaseInput v-model="form.degree" label="Degree" placeholder="Bachelor Degree" />
        </div>
        <BaseInput v-model="form.field_of_study" label="Field of study" />
        <BaseTextarea v-model="form.description" label="Description" :rows="3" />
        <div class="form-row">
          <BaseInput v-model="form.start_date" label="Start date" type="date" />
          <BaseInput v-model="form.end_date" label="End date" type="date" />
        </div>
        <BaseInput v-model="form.display_order" label="Display order" type="number" />
      </form>
      <template #footer>
        <BaseButton type="submit" form="education-form" variant="primary" :loading="saving" label="save" />
        <BaseButton label="cancel" @click="showForm = false" />
      </template>
    </BaseModal>

    <BaseModal v-model="showView" :title="viewing ? `${viewing.degree} · ${viewing.school}` : ''">
      <dl v-if="viewing" class="view-detail__meta">
        <div>
          <dt>Field of study</dt>
          <dd>{{ viewing.field_of_study || '—' }}</dd>
        </div>
        <div>
          <dt>Start</dt>
          <dd>{{ viewing.start_date?.slice(0, 10) || '—' }}</dd>
        </div>
        <div>
          <dt>End</dt>
          <dd>{{ viewing.end_date ? viewing.end_date.slice(0, 10) : '—' }}</dd>
        </div>
        <div>
          <dt>Description</dt>
          <dd>{{ viewing.description || '—' }}</dd>
        </div>
      </dl>
      <template #footer>
        <BaseButton label="close" @click="showView = false" />
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
import educationService from '../../services/educationService'
import { useToastStore } from '../../stores/toastStore'
import { validate, isRequired } from '../../utils/validators'

const toast = useToastStore()

const education = ref([])
const showForm = ref(false)
const showView = ref(false)
const viewing = ref(null)
const editingId = ref(null)
const saving = ref(false)
const errors = reactive({})

const emptyForm = () => ({ school: '', degree: '', field_of_study: '', start_date: '', end_date: '', description: '', display_order: 0 })
const form = reactive(emptyForm())

async function load() {
  const { data } = await educationService.getAll()
  education.value = data
}

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  clearErrors()
  showForm.value = true
}

function openEdit(e) {
  Object.assign(form, e, {
    start_date: e.start_date ? e.start_date.slice(0, 10) : '',
    end_date: e.end_date ? e.end_date.slice(0, 10) : ''
  })
  editingId.value = e.id
  clearErrors()
  showForm.value = true
}

function openView(e) {
  viewing.value = e
  showView.value = true
}

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

function validateForm() {
  const result = validate(form, { school: [[isRequired, 'School is required.']] })
  clearErrors()
  Object.assign(errors, result)
  return Object.keys(result).length === 0
}

async function save() {
  if (!validateForm()) return
  saving.value = true
  try {
    const payload = { ...form, end_date: form.end_date || null }
    if (editingId.value) {
      await educationService.update(editingId.value, payload)
      toast.success('Education entry updated successfully.')
    } else {
      await educationService.create(payload)
      toast.success('Education entry created successfully.')
    }
    showForm.value = false
    await load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save education entry.')
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this education entry?')) return
  try {
    await educationService.remove(id)
    toast.success('Education entry deleted.')
    await load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete education entry.')
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
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
}

.list-item__body {
  flex: 1;
}

.list-item__body h3 {
  font-size: 1rem;
}

.list-item__meta {
  color: var(--text-faint);
  font-size: 0.78rem;
  margin-top: var(--space-1);
}

.list-item__actions {
  display: flex;
  gap: var(--space-2);
}

.empty-note {
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  padding: var(--space-5);
}

.view-detail__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.view-detail__meta>div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  border-top: 1px solid var(--border);
  padding-top: var(--space-3);
}

.view-detail__meta dt {
  color: var(--text-faint);
  font-size: 0.78rem;
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.view-detail__meta dd {
  margin: 0;
  font-size: 0.88rem;
  text-align: right;
}

@media (max-width: 700px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
