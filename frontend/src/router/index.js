import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  // ---------- Public portfolio site ----------
  {
    path: '/',
    name: 'home',
    component: () => import('../views/public/HomeView.vue')
  },

  // ---------- Admin dashboard ----------
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/DashboardHome.vue') },
      { path: 'profile', name: 'admin-profile', component: () => import('../views/admin/ProfileManage.vue') },
      { path: 'projects', name: 'admin-projects', component: () => import('../views/admin/ProjectsManage.vue') },
      { path: 'skills', name: 'admin-skills', component: () => import('../views/admin/SkillsManage.vue') },
      { path: 'experience', name: 'admin-experience', component: () => import('../views/admin/ExperienceManage.vue') },
      { path: 'education', name: 'admin-education', component: () => import('../views/admin/EducationManage.vue') },
      { path: 'messages', name: 'admin-messages', component: () => import('../views/admin/MessagesManage.vue') },
      { path: 'settings', name: 'admin-settings', component: () => import('../views/admin/SettingsView.vue') }
    ]
  },

  // ---------- 404 ----------
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/public/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }
  return true
})

export default router
