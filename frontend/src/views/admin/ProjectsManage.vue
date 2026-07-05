<template>
  <div>
    <header class="page-head">
      <div>
        <p class="eyebrow">portfolio content</p>
        <h1 class="page-title">Projects</h1>
        <p class="page-sub">Manage the projects shown in your "Work" section.</p>
      </div>
      <BaseButton variant="primary" label="+ add project" @click="openCreate" />
    </header>

    <div class="list">
      <div v-for="p in projects" :key="p.id" class="list-item card">
        <div class="list-item__thumb" v-if="p.image_url"><img :src="p.image_url" /></div>
        <div class="list-item__body">
          <h3>{{ p.title }}</h3>
          <p class="list-item__meta mono">{{ p.tech_stack }}</p>
        </div>
        <div class="list-item__actions">
          <BaseButton size="sm" label="view" @click="openView(p)" />
          <BaseButton size="sm" label="edit" @click="openEdit(p)" />
          <BaseButton size="sm" variant="danger" label="delete" @click="remove(p.id)" />
        </div>
      </div>
      <p v-if="!projects.length" class="empty-note">No projects yet. Click "add project" to create one.</p>
    </div>

    <!-- ============ ADD / EDIT MODAL ============ -->
    <BaseModal v-model="showForm" :title="editingId ? 'Edit project' : 'New project'">
      <form id="project-form" @submit.prevent="save" novalidate>
        <BaseInput v-model="form.title" label="Title" required :error="errors.title" />
        <BaseTextarea v-model="form.description" label="Description" :rows="3" />
        <div class="field">
          <label>Image</label>
          <ImageUploader v-model="form.image_url" />
        </div>
        <BaseInput v-model="form.tech_stack" label="Tech stack (comma separated)" placeholder="Vue3, Node.js, MySQL" />
        <div class="form-row">
          <BaseInput v-model="form.demo_url" label="Demo URL" type="url" :error="errors.demo_url" />
          <BaseInput v-model="form.repo_url" label="Repo URL" type="url" :error="errors.repo_url" />
        </div>
        <div class="form-row">
          <BaseInput v-model="form.display_order" label="Display order" type="number" />
          <BaseCheckbox v-model="form.featured" label="Featured project" />
        </div>
      </form>

      <template #footer>
        <BaseButton type="submit" form="project-form" variant="primary" :loading="saving" label="save" />
        <BaseButton label="cancel" @click="showForm = false" />
      </template>
    </BaseModal>

    <!-- ============ VIEW DETAILS MODAL ============ -->
    <BaseModal v-model="showView" :title="viewing?.title || ''" size="lg">
      <div v-if="viewing" class="view-detail">
        <div v-if="viewing.image_url" class="view-detail__image">
          <img :src="viewing.image_url" :alt="viewing.title" />
        </div>
        <p class="view-detail__desc">{{ viewing.description || 'No description provided.' }}</p>
        <div class="view-detail__tech">
          <span v-for="t in techList(viewing.tech_stack)" :key="t" class="badge">{{ t }}</span>
        </div>
        <dl class="view-detail__meta">
          <div>
            <dt>Featured</dt>
            <dd>{{ viewing.featured ? 'Yes' : 'No' }}</dd>
          </div>
          <div>
            <dt>Display order</dt>
            <dd>{{ viewing.display_order }}</dd>
          </div>
          <div v-if="viewing.demo_url">
            <dt>Demo</dt>
            <dd><a :href="viewing.demo_url" target="_blank">{{ viewing.demo_url }}</a></dd>
          </div>
          <div v-if="viewing.repo_url">
            <dt>Repository</dt>
            <dd><a :href="viewing.repo_url" target="_blank">{{ viewing.repo_url }}</a></dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{{ new Date(viewing.created_at).toLocaleString() }}</dd>
          </div>
        </dl>
      </div>
      <template #footer>
        <BaseButton label="close" @click="showView = false" />
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import BaseModal from '../../components/base/BaseModal.vue'
import ImageUploader from '../../components/ImageUploader.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseCheckbox from '../../components/base/BaseCheckbox.vue'
import projectService from '../../services/projectService'
import { useToastStore } from '../../stores/toastStore'
import { validate, isRequired, isUrl } from '../../utils/validators'

const toast = useToastStore()

const projects = ref([])
const showForm = ref(false)
const showView = ref(false)
const viewing = ref(null)
const editingId = ref(null)
const saving = ref(false)
const errors = reactive({})

const emptyForm = () => ({
  title: '', description: '', image_url: '', tech_stack: '', demo_url: '', repo_url: '', featured: false, display_order: 0
})
const form = reactive(emptyForm())

function techList(str) {
  if (!str) return []
  return str.split(',').map((t) => t.trim()).filter(Boolean)
}

async function load() {
  const { data } = await projectService.getAll()
  projects.value = data
}

function openCreate() {
  Object.assign(form, emptyForm())
  editingId.value = null
  clearErrors()
  showForm.value = true
}

function openEdit(p) {
  Object.assign(form, p, { featured: !!p.featured })
  editingId.value = p.id
  clearErrors()
  showForm.value = true
}

function openView(p) {
  viewing.value = p
  showView.value = true
}

function clearErrors() {
  Object.keys(errors).forEach((k) => delete errors[k])
}

function validateForm() {
  const result = validate(form, {
    title: [[isRequired, 'Title is required.']],
    demo_url: [[isUrl, 'Please enter a valid URL.']],
    repo_url: [[isUrl, 'Please enter a valid URL.']]
  })
  clearErrors()
  Object.assign(errors, result)
  return Object.keys(result).length === 0
}

async function save() {
  if (!validateForm()) return
  saving.value = true
  try {
    if (editingId.value) {
      await projectService.update(editingId.value, form)
      toast.success('Project updated successfully.')
    } else {
      await projectService.create(form)
      toast.success('Project created successfully.')
    }
    showForm.value = false
    await load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to save project.')
  } finally {
    saving.value = false
  }
}

async function remove(id) {
  if (!confirm('Delete this project? This cannot be undone.')) return
  try {
    await projectService.remove(id)
    toast.success('Project deleted.')
    await load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete project.')
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

.list-item__thumb {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.list-item__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.view-detail__image {
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--space-5);
  max-height: 280px;
}

.view-detail__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-detail__desc {
  color: var(--text-dim);
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

.view-detail__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
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
  text-align: right;
  word-break: break-all;
}

@media (max-width: 700px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
