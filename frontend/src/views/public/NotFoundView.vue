<template>
  <div class="notfound">
    <p class="mono notfound__code">404</p>
    <h1>Page not found</h1>
    <p class="notfound__desc">The page you're looking for doesn't exist.</p>
    <router-link to="/" class="btn btn-primary">back to home</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.notfound {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-3);
  padding: var(--space-5);
}
.notfound__code {
  font-size: 4rem;
  color: var(--accent);
}
.notfound__desc {
  color: var(--text-dim);
  margin-bottom: var(--space-4);
}
</style>
