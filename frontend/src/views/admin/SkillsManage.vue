<template>
  <div>
    <header class="page-head">
      <div>
        <p class="eyebrow">portfolio content</p>
        <h1 class="page-title">Skills</h1>
        <p class="page-sub">Manage the skills shown in your "Skills" section.</p>
      </div>
      <BaseButton variant="primary" label="+ add skill" @click="openCreate" />
    </header>

    <div class="list">
      <div v-for="s in skills" :key="s.id" class="list-item card">
        <div class="list-item__body">
          <h3>{{ s.name }}</h3>
          <p class="list-item__meta mono">{{ s.category }} · {{ s.proficiency }}%</p>
        </div>
        <div class="list-item__actions">
          <BaseButton size="sm" label="view" @click="openView(s)" />
          <BaseButton size="sm" label="edit" @click="openEdit(s)" />
          <BaseButton size="sm" variant="danger" label="delete" @click="remove(s.id)" />
        </div>
      </div>
      <p v-if="!skills.length" class="empty-note">No skills yet. Click "add skill" to create one.</p>
    </div>

    <BaseModal v-model="showForm" :title="editingId ? 'Edit skill' : 'New skill'">
      <form id="skill-form" @submit.prevent="save" novalidate>
        <div class="form-row">
          <BaseInput v-model="form.name" label="Name" required :error="errors.name" />
          <BaseInput v-model="form.category" label="Category" placeholder="Frontend / Backend / Tools" />
        </div>
        <div class="form-row">
          <div class="field">
            <label>Proficiency ({{ form.proficiency }}%)</label>
            <input v-model.number="form.proficiency" type="range" min="0" max="100" />
          </div>
          <BaseInput v-model="form.display_order" label="Display order" type="number" />
        </div>
      </form>
      <template #footer>
        <BaseButton type="submit" form="skill-form" variant="primary" :loading="saving" label="save" />
        <BaseButton label="cancel" @click="showForm = false" />
      </template>
    </BaseModal>

    <BaseModal v-model="showView" :title="viewing?.name || ''">
      <dl v-if="viewing" class="view-detail__meta">
        <div>
          <dt>Category</dt>
          <dd>{{ viewing.category }}</dd>
        </div>
        <div>
          <dt>Proficiency</dt>
          <dd>{{ viewing.proficiency }}%</dd>
        </div>
        <div>
          <dt>Display order</dt>
          <dd>{{ viewing.display_order }}</dd>
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
import BaseButton from '../../components/base/BaseButton.vue'
import skillService from '../../services/skillService'
import { useToastStore } from '../../stores/toastStore'
import { validate, isRequired } from '../../utils/validators'

const toast = useToastStore()

const skills = ref([])
const showForm = ref(false)
const showView = ref(false)
const viewing = ref(null)
const editingId = ref(null)
const saving = ref(false)
const errors = reactive({})

const emptyForm = () => ({ name: '', category: 'Frontend', proficiency: 50, icon_class: '', display_order: 0 })
const form = reactive(emptyForm())

async function load() {
  const { data } = await skillService.getAll()
  skills.value = data
}

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  clearErrors()
  showForm.value = true
}

function openEdit(s) {
  Object.assign(form, s)
  editingId.value = s.id
  clearErrors()
  showForm.value = true
}

function openView(s) {
  viewing.value = s
  showView.value = true
}

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

function validateForm() {
  const result = validate(form, { name: [[isRequired, 'Skill name is required.']] })
  clearErrors()
  Object.assign(errors, result)
  return Object.keys(result).length === 0
}

async function save() {
  if (!validateForm()) return
  saving.value = true
  try {
    if (editingId.value) {
      await skillService.update(editingId.value, form)
      toast.success('Skill updated successfully.')
    } else {
      await skillService.create(form)
      toast.success('Skill created successfully.')
    }
    showForm.value = false
    await load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save skill.')
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this skill?')) return
  try {
    await skillService.remove(id)
    toast.success('Skill deleted.')
    await load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete skill.')
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
}

.view-detail__meta dd {
  margin: 0;
  font-size: 0.88rem;
}

@media (max-width: 700px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
