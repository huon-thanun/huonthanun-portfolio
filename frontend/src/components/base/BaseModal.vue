<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @mousedown.self="close">
        <div class="modal" :class="size ? `modal--${size}` : ''" role="dialog" aria-modal="true">
          <div class="modal__head">
            <h2 class="modal__title">{{ title }}</h2>
            <button class="modal__close" @click="close" aria-label="Close">×</button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal__foot">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: '' } // '' | 'lg'
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

function onKeydown(e) {
  if (e.key === 'Escape' && props.modelValue) close()
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  }
)

window.addEventListener('keydown', onKeydown)
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 14, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-7) var(--space-5);
  z-index: 1000;
  overflow-y: auto;
}

.modal {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 520px;
  box-shadow: var(--shadow-lg);
}

.modal--lg {
  max-width: 720px;
}

.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border);
}

.modal__title {
  font-size: 1.1rem;
}

.modal__close {
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 1.4rem;
  line-height: 1;
  padding: 0;
}
.modal__close:hover { color: var(--accent); }

.modal__body {
  padding: var(--space-6);
}

.modal__foot {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid var(--border);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
