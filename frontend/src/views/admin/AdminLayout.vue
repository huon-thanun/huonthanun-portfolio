<template>
  <div class="admin">
    <aside class="admin__sidebar">
      <div class="admin__brand mono">
        <span class="admin__brand-bracket">&lt;</span>admin<span class="admin__brand-bracket">/&gt;</span>
      </div>

      <nav class="admin__nav">
        <router-link to="/admin/dashboard" class="admin__link">Dashboard</router-link>
        <router-link to="/admin/profile" class="admin__link">Profile</router-link>
        <router-link to="/admin/projects" class="admin__link">Projects</router-link>
        <router-link to="/admin/skills" class="admin__link">Skills</router-link>
        <router-link to="/admin/experience" class="admin__link">Experience</router-link>
        <router-link to="/admin/education" class="admin__link">Education</router-link>
        <router-link to="/admin/messages" class="admin__link">
          Messages
          <span v-if="unread" class="admin__badge">{{ unread }}</span>
        </router-link>
        <router-link to="/admin/settings" class="admin__link">Settings</router-link>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import profileService from '../../services/profileService'

const auth = useAuthStore()
const router = useRouter()
const unread = ref(0)

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

onMounted(fetchUnread)
</script>

<style scoped>
.admin {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
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
.admin__brand-bracket { color: var(--accent); }

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

.admin__link--muted { color: var(--text-faint); font-size: 0.82rem; }

.admin__main {
  padding: var(--space-7);
  overflow-x: hidden;
}

@media (max-width: 900px) {
  .admin { grid-template-columns: 1fr; }
  .admin__sidebar {
    position: static;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
  .admin__nav { flex-direction: row; flex-wrap: wrap; }
  .admin__foot { flex-direction: row; margin-left: auto; border-top: none; padding-top: 0; }
}
</style>
