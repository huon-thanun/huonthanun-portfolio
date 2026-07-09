<template>
  <div class="field">
    <label v-if="label" :for="id">
      {{ label }}
      <span v-if="required" class="field__required">*</span>
    </label>
    <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :min="min" :max="max" :step="step"
      :class="{ 'field-invalid': error }"
      @input="$emit('update:modelValue', type === 'number' ? Number($event.target.value) : $event.target.value)" />
    <p v-if="error" class="helper-error">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  min: { type: [String, Number], default: undefined },
  max: { type: [String, Number], default: undefined },
  step: { type: [String, Number], default: undefined },
  id: { type: String, default: () => `input-${Math.random().toString(36).slice(2, 9)}` }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.field__required {
  color: var(--danger);
  margin-left: 2px;
}
</style>
