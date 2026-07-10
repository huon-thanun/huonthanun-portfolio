<template>
  <div class="uploader">
    <div class="uploader__preview" v-if="modelValue">
      <img :src="modelValue" alt="Preview" @error="onImageError" />
    </div>
    <label class="btn btn-sm uploader__btn">
      {{ uploading ? 'uploading…' : (modelValue ? 'change image' : 'upload image') }}
      <input type="file" accept="image/*" @change="handleFile" hidden />
    </label>
    <button v-if="modelValue" type="button" class="btn btn-sm btn-danger" @click="$emit('update:modelValue', '')">
      remove
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToastStore } from '../stores/toastStore'
import { onImageError } from '../utils/imageFallback'

defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const toast = useToastStore()
const uploading = ref(false)

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

async function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    toast.error('Image upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in frontend/.env')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error?.message || 'Upload failed.')
    }

    emit('update:modelValue', data.secure_url)
    toast.success('Image uploaded.')
  } catch (err) {
    toast.error(err.message || 'Upload failed.')
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

.uploader__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploader__btn {
  display: inline-flex;
}
</style>