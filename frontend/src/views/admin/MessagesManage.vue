<template>
  <div>
    <header class="page-head">
      <p class="eyebrow">contact form</p>
      <h1 class="page-title">Messages</h1>
      <p class="page-sub">Messages sent through your portfolio's contact form.</p>
    </header>

    <div class="list">
      <div v-for="m in messages" :key="m.id" class="msg card" :class="{ 'msg--unread': !m.is_read }"
        @click="openView(m)">
        <div class="msg__head">
          <div>
            <h3>{{ m.subject || '(no subject)' }}</h3>
            <p class="msg__from mono">{{ m.name }} · {{ m.email }}</p>
          </div>
          <p class="msg__date mono">{{ new Date(m.created_at).toLocaleDateString() }}</p>
        </div>
        <p class="msg__preview">{{ m.message }}</p>
      </div>
      <p v-if="!messages.length" class="empty-note">No messages yet.</p>
    </div>

    <BaseModal v-model="showView" :title="viewing?.subject || '(no subject)'">
      <div v-if="viewing" class="view-detail">
        <dl class="view-detail__meta">
          <div>
            <dt>From</dt>
            <dd>{{ viewing.name }}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd><a :href="`mailto:${viewing.email}`">{{ viewing.email }}</a></dd>
          </div>
          <div>
            <dt>Received</dt>
            <dd>{{ new Date(viewing.created_at).toLocaleString() }}</dd>
          </div>
        </dl>
        <p class="view-detail__body">{{ viewing.message }}</p>
      </div>
      <template #footer>
        <BaseButton v-if="viewing && !viewing.is_read" size="sm" label="mark as read" @click="markRead(viewing)" />
        <BaseButton size="sm" variant="danger" label="delete" @click="removeAndClose(viewing?.id)" />
        <BaseButton label="close" @click="showView = false" />
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import messageService from '../../services/messageService'
import { useToastStore } from '../../stores/toastStore'

const toast = useToastStore()
const messages = ref([])
const showView = ref(false)
const viewing = ref(null)

async function load() {
  const { data } = await messageService.getAll()
  messages.value = data
}

function openView(m) {
  viewing.value = m
  showView.value = true
  if (!m.is_read) markRead(m, false)
}

async function markRead(m, notify = true) {
  try {
    await messageService.markRead(m.id)
    m.is_read = 1
    if (notify) toast.success('Marked as read.')
  } catch (err) {
    toast.error('Failed to update message.')
  }
}

async function removeAndClose(id) {
  if (!id) return
  if (!confirm('Delete this message?')) return
  try {
    await messageService.remove(id)
    toast.success('Message deleted.')
    showView.value = false
    await load()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete message.')
  }
}

onMounted(load)
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

.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 760px;
}

.msg {
  padding: var(--space-5);
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.1s ease;
}

.msg:hover {
  transform: translateX(2px);
}

.msg--unread {
  border-left-color: var(--accent);
}

.msg__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2);
  gap: var(--space-3);
}

.msg__head h3 {
  font-size: 1rem;
}

.msg__from {
  color: var(--text-faint);
  font-size: 0.78rem;
  margin-top: var(--space-1);
}

.msg__date {
  color: var(--text-faint);
  font-size: 0.72rem;
  white-space: nowrap;
}

.msg__preview {
  color: var(--text-dim);
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  margin-bottom: var(--space-5);
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
  word-break: break-all;
}

.view-detail__body {
  color: var(--text);
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
