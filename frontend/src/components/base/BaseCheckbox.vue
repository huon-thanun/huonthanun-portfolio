<template>
  <div class="field field--checkbox">
    <label>
      <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
      {{ label }}
    </label>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.field--checkbox {
  display: flex;
  align-items: flex-end;
}
.field--checkbox label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-transform: none;
  font-family: var(--font-body);
  color: var(--text);
  font-size: 0.92rem;
}
.field--checkbox input {
  width: auto;
}
</style>
