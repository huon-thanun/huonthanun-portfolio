<template>
  <div class="field">
    <label v-if="label" :for="id">
      {{ label }}
      <span v-if="required" class="field__required">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :class="{ 'field-invalid': error }"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
    <p v-if="error" class="helper-error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: [String, Number], default: 4 },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  id: { type: String, default: () => `textarea-${Math.random().toString(36).slice(2, 9)}` }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.field__required {
  color: var(--danger);
  margin-left: 2px;
}
</style>
