<template>
  <div>
    <header class="page-head">
      <p class="eyebrow">contact form</p>
      <h1 class="page-title">Messages</h1>
      <p class="page-sub">Messages sent through your portfolio's contact form.</p>
    </header>

    <div class="list">
      <div v-for="m in messages" :key="m.id" class="msg card" :class="{ 'msg--unread': !m.is_read }">
        <div class="msg__head">
          <div>
            <h3>{{ m.subject || '(no subject)' }}</h3>
            <p class="msg__from mono">{{ m.name }} · {{ m.email }}</p>
          </div>
          <p class="msg__date mono">{{ new Date(m.created_at).toLocaleString() }}</p>
        </div>
        <p class="msg__body">{{ m.message }}</p>
        <div class="msg__actions">
          <button v-if="!m.is_read" class="btn btn-sm" @click="markRead(m)">mark as read</button>
          <button class="btn btn-sm btn-danger" @click="remove(m.id)">delete</button>
        </div>
      </div>
      <p v-if="!messages.length" class="empty-note">No messages yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import messageService from '../../services/messageService'

const messages = ref([])

async function load() {
  const { data } = await messageService.getAll()
  messages.value = data
}

async function markRead(m) {
  await messageService.markRead(m.id)
  m.is_read = 1
}

async function remove(id) {
  if (!confirm('Delete this message?')) return
  await messageService.remove(id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.page-head { margin-bottom: var(--space-7); }
.page-title { font-size: 1.8rem; margin-top: var(--space-2); }
.page-sub { color: var(--text-dim); margin-top: var(--space-2); }

.list { display: flex; flex-direction: column; gap: var(--space-4); max-width: 760px; }
.msg { padding: var(--space-5); border-left: 3px solid transparent; }
.msg--unread { border-left-color: var(--accent); }
.msg__head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3); gap: var(--space-3); }
.msg__head h3 { font-size: 1rem; }
.msg__from { color: var(--text-faint); font-size: 0.78rem; margin-top: var(--space-1); }
.msg__date { color: var(--text-faint); font-size: 0.72rem; white-space: nowrap; }
.msg__body { color: var(--text-dim); font-size: 0.92rem; margin-bottom: var(--space-4); white-space: pre-wrap; }
.msg__actions { display: flex; gap: var(--space-2); }
.empty-note { color: var(--text-faint); font-family: var(--font-mono); font-size: 0.85rem; padding: var(--space-5); }
</style>
