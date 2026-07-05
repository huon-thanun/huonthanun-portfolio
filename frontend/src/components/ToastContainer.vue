<template>
  <teleport to="body">
    <div class="toast-stack">
      <transition-group name="toast">
        <div
          v-for="t in toastStore.toasts"
          :key="t.id"
          class="toast"
          :class="`toast--${t.type}`"
          role="alert"
        >
          <span class="toast__icon">{{ icon(t.type) }}</span>
          <p class="toast__msg">{{ t.message }}</p>
          <button class="toast__close" @click="toastStore.remove(t.id)" aria-label="Dismiss">×</button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useToastStore } from '../stores/toastStore'

const toastStore = useToastStore()

function icon(type) {
  if (type === 'success') return '✓'
  if (type === 'error') return '!'
  return 'i'
}
</script>

<style scoped>
.toast-stack {
  position: fixed;
  top: var(--space-5);
  right: var(--space-5);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: min(360px, calc(100vw - 2rem));
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--bg-elev);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

.toast__icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
}

.toast--success { border-left: 3px solid var(--success); }
.toast--success .toast__icon { background: rgba(74, 222, 128, 0.15); color: var(--success); }

.toast--error { border-left: 3px solid var(--danger); }
.toast--error .toast__icon { background: var(--danger-soft); color: var(--danger); }

.toast--info { border-left: 3px solid var(--accent); }
.toast--info .toast__icon { background: var(--accent-soft); color: var(--accent); }

.toast__msg {
  flex: 1;
  font-size: 0.88rem;
  color: var(--text);
  line-height: 1.4;
}

.toast__close {
  background: none;
  border: none;
  color: var(--text-faint);
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
}
.toast__close:hover { color: var(--text); }

.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
