<template>
  <div class="admin">
    <button class="admin__toggle" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>

    <div v-if="sidebarOpen" class="admin__backdrop" @click="sidebarOpen = false"></div>

    <aside class="admin__sidebar" :class="{ 'admin__sidebar--open': sidebarOpen }">
      <div class="admin__brand mono">
        <span class="admin__brand-bracket">&lt;</span>admin<span class="admin__brand-bracket">/&gt;</span>
      </div>

      <nav class="admin__nav">
        <router-link to="/admin/dashboard" class="admin__link" @click="sidebarOpen = false">Dashboard</router-link>
        <router-link to="/admin/profile" class="admin__link" @click="sidebarOpen = false">Profile</router-link>
        <router-link to="/admin/projects" class="admin__link" @click="sidebarOpen = false">Projects</router-link>
        <router-link to="/admin/skills" class="admin__link" @click="sidebarOpen = false">Skills</router-link>
        <router-link to="/admin/experience" class="admin__link" @click="sidebarOpen = false">Experience</router-link>
        <router-link to="/admin/education" class="admin__link" @click="sidebarOpen = false">Education</router-link>
        <router-link to="/admin/messages" class="admin__link" @click="sidebarOpen = false">
          Messages
          <span v-if="unread" class="admin__badge">{{ unread }}</span>
        </router-link>
        <router-link to="/admin/settings" class="admin__link" @click="sidebarOpen = false">Settings</router-link>
      </nav>

      <div class="admin__foot">
        <a href="/" target="_blank" class="admin__link admin__link--muted">View site ↗</a>
        <button class="btn btn-sm admin__logout" @click="logout">Log out</button>
      </div>
    </aside>

    <main class="admin__main">
      <router-view @stats-updated="fetchUnread" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import profileService from '../../services/profileService'

const auth = useAuthStore()
const router = useRouter()
const unread = ref(0)
const sidebarOpen = ref(false)

function logout() {
  auth.logout()
  router.push('/admin/login')
}

async function fetchUnread() {
  try {
    const { data } = await profileService.getStats()
    unread.value = data.unreadMessages
  } catch (err) {
    console.error(err)
  }
}

watch(() => router.currentRoute.value.path, () => { sidebarOpen.value = false })

onMounted(fetchUnread)
</script>

<style scoped>
.admin {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.admin__toggle {
  display: none;
  position: fixed;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 200;
  flex-direction: column;
  gap: 5px;
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px;
}

.admin__toggle span {
  width: 20px;
  height: 2px;
  background: var(--text);
}

.admin__backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 14, 0.6);
  z-index: 150;
}

.admin__sidebar {
  background: var(--bg-elev);
  border-right: 1px solid var(--border);
  padding: var(--space-6) var(--space-5);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.admin__brand {
  font-size: 1.1rem;
  margin-bottom: var(--space-7);
}

.admin__brand-bracket {
  color: var(--accent);
}

.admin__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.admin__link {
  padding: 0.65rem 0.8rem;
  border-radius: var(--radius-sm);
  color: var(--text-dim);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.15s ease, color 0.15s ease;
}

.admin__link:hover {
  background: var(--bg-elev-2);
  color: var(--text);
}

.admin__link.router-link-exact-active {
  background: var(--accent-soft);
  color: var(--accent);
}

.admin__badge {
  background: var(--danger);
  color: #2a0a0a;
  font-size: 0.7rem;
  font-family: var(--font-mono);
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
}

.admin__foot {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  border-top: 1px solid var(--border);
  padding-top: var(--space-5);
}

.admin__link--muted {
  color: var(--text-faint);
  font-size: 0.82rem;
}

.admin__main {
  padding: var(--space-7);
  overflow-x: hidden;
  min-width: 0;
}

/* ---------- Mobile: sidebar becomes a slide-in drawer ---------- */
@media (max-width: 900px) {
  .admin {
    grid-template-columns: 1fr;
  }

  .admin__toggle {
    display: flex;
  }

  .admin__backdrop {
    display: block;
  }

  .admin__sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 260px;
    max-width: 80vw;
    height: 100vh;
    z-index: 180;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    box-shadow: var(--shadow-lg);
  }

  .admin__sidebar--open {
    transform: translateX(0);
  }

  .admin__main {
    padding: var(--space-6) var(--space-4);
    padding-top: calc(var(--space-4) + 52px);
    /* room for toggle button */
  }
}

@media (max-width: 480px) {
  .admin__main {
    padding: var(--space-5) var(--space-3);
    padding-top: calc(var(--space-3) + 52px);
  }
}
</style>