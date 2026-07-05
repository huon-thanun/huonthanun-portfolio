<template>
  <div class="uploader">
    <div class="uploader__preview" v-if="modelValue">
      <img :src="modelValue" alt="Preview" />
    </div>
    <label class="btn btn-sm uploader__btn">
      {{ uploading ? 'uploading…' : (modelValue ? 'change image' : 'upload image') }}
      <input type="file" accept="image/*" @change="handleFile" hidden />
    </label>
    <button v-if="modelValue" type="button" class="btn btn-sm btn-danger" @click="$emit('update:modelValue', '')">
      remove
    </button>
    <p v-if="error" class="helper-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import uploadService from '../services/uploadService'

defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const uploading = ref(false)
const error = ref('')

async function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  error.value = ''
  try {
    const { data } = await uploadService.upload(file)
    emit('update:modelValue', data.url)
  } catch (err) {
    error.value = err.response?.data?.message || 'Upload failed.'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.uploader {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.uploader__preview {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
}
.uploader__preview img { width: 100%; height: 100%; object-fit: cover; }
.uploader__btn { display: inline-flex; }
</style>
