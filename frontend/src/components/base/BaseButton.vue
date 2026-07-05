<template>
  <button
    :type="type"
    :form="form"
    class="btn"
    :class="[variantClass, sizeClass]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <slot>{{ loading ? loadingText : label }}</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  type: { type: String, default: 'button' }, // button | submit
  form: { type: String, default: undefined },
  variant: { type: String, default: 'default' }, // default | primary | danger
  size: { type: String, default: 'md' }, // md | sm
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'saving…' }
})
defineEmits(['click'])

const variantClass = computed(() => (props.variant === 'default' ? '' : `btn-${props.variant}`))
const sizeClass = computed(() => (props.size === 'sm' ? 'btn-sm' : ''))
</script>
