<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="container nav__inner">
      <a href="#home" class="nav__logo mono">
        <span class="nav__logo-bracket">&lt;</span>dev<span class="nav__logo-bracket">/&gt;</span>
      </a>

      <nav class="nav__links" :class="{ 'nav__links--open': menuOpen }">
        <a href="#about" class="mono" @click="menuOpen = false">01. about</a>
        <a href="#skills" class="mono" @click="menuOpen = false">02. skills</a>
        <a href="#projects" class="mono" @click="menuOpen = false">03. work</a>
        <a href="#experience" class="mono" @click="menuOpen = false">04. experience</a>
        <a href="#contact" class="mono" @click="menuOpen = false">05. contact</a>
      </nav>

      <button class="nav__toggle" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid transparent;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.nav--scrolled {
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--border);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.nav__logo {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.nav__logo-bracket {
  color: var(--accent);
}

.nav__links {
  display: flex;
  gap: var(--space-6);
}

.nav__links a {
  font-size: 0.85rem;
  color: var(--text-dim);
  transition: color 0.2s ease;
}

.nav__links a:hover {
  color: var(--accent);
}

.nav__toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 8px;
}

.nav__toggle span {
  width: 22px;
  height: 2px;
  background: var(--text);
}

@media (max-width: 768px) {
  .nav__toggle { display: flex; }
  .nav__links {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: var(--bg-elev);
    border-bottom: 1px solid var(--border);
    flex-direction: column;
    padding: var(--space-5);
    gap: var(--space-4);
    display: none;
  }
  .nav__links--open {
    display: flex;
  }
}
</style>
