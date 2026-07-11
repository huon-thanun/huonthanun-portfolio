<template>
  <div>
    <SiteNavbar />

    <!-- ============ HERO ============ -->
    <section id="home" class="hero">
      <div class="container hero__inner">
        <div class="hero__text">
          <button v-if="profile.avatar_url" class="hero__avatar" @click="showProfileDetail = true"
            aria-label="View profile details">
            <img :src="mediaUrl(profile.avatar_url)" :alt="profile.full_name" @error="onImageError" />
          </button>
          <p class="eyebrow">available for work</p>
          <h1 class="hero__title">
            Hi, I'm {{ profile.full_name || 'a developer' }}.<br />
            I build things for <span class="hero__accent">the web.</span>
          </h1>
          <p class="hero__tagline">{{ profile.tagline || 'Junior full-stack web developer.' }}</p>
          <div class="hero__actions">
            <a href="#projects" class="btn btn-primary">
              <i class="bi bi-kanban" aria-hidden="true"></i>
              view my work
            </a>
            <a href="#contact" class="btn">
              <i class="bi bi-chat-dots" aria-hidden="true"></i>
              get in touch
            </a>
          </div>
        </div>

        <div class="hero__terminal">
          <div class="term__bar">
            <span class="term__dot term__dot--r"></span>
            <span class="term__dot term__dot--y"></span>
            <span class="term__dot term__dot--g"></span>
            <span class="term__filename mono">whoami.sh</span>
          </div>
          <div class="term__body mono">
            <p><span class="term__prompt">$</span> whoami</p>
            <p class="term__out">{{ profile.title || 'Junior Full-Stack Developer' }}</p>
            <p><span class="term__prompt">$</span> cat stack.txt</p>
            <p class="term__out">Vue 3 · Node.js · Express · MySQL</p>
            <p><span class="term__prompt">$</span> status<span class="term__cursor">_</span></p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ ABOUT ============ -->
    <section id="about" class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">01 / about</p>
          <h2 class="section-title">A little about me</h2>
        </div>
        <div class="about__grid">
          <p class="about__text">
            {{ profile.about_text || 'About information will appear here once added from thedashboard.' }}
          </p>
          <ul class="about__meta mono">
            <li v-if="profile.location"><span>location</span>{{ profile.location }}</li>
            <li v-if="profile.email"><span>email</span>{{ profile.email }}</li>
            <li v-if="profile.phone"><span>phone</span>{{ profile.phone }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ============ SKILLS ============ -->
    <section id="skills" class="section section--elev">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">02 / skills</p>
          <h2 class="section-title">Tools I work with</h2>
        </div>
        <div class="skills__grid">
          <div v-for="skill in skills" :key="skill.id" class="skill-card card">
            <div class="skill-card__head">
              <span class="mono skill-card__name">{{ skill.name }}</span>
              <span class="badge">{{ skill.category }}</span>
            </div>
            <div class="skill-card__bar">
              <div class="skill-card__fill" :style="{ width: skill.proficiency + '%' }"></div>
            </div>
          </div>
          <p v-if="!skills.length" class="empty-note">Skills will show up here once added from the dashboard.</p>
        </div>
      </div>
    </section>

    <!-- ============ PROJECTS ============ -->
    <section id="projects" class="section">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">03 / work</p>
          <h2 class="section-title">Selected projects</h2>
        </div>
        <div class="projects__grid">
          <article v-for="p in projects" :key="p.id" class="project-card card" @click="openProjectDetail(p)">
            <div class="project-card__image" v-if="p.image_url">
              <img :src="mediaUrl(p.image_url)" :alt="p.title" @error="onImageError" />
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">{{ p.title }}</h3>
              <p class="project-card__desc">{{ p.description }}</p>
              <div class="project-card__tech">
                <span v-for="t in techList(p.tech_stack)" :key="t" class="badge">{{ t }}</span>
              </div>
              <div class="project-card__links" @click.stop>
                <a v-if="p.demo_url" :href="p.demo_url" target="_blank" class="btn btn-sm">live demo</a>
                <a v-if="p.repo_url" :href="p.repo_url" target="_blank" class="btn btn-sm">source</a>
              </div>
            </div>
          </article>
          <p v-if="!projects.length" class="empty-note">Projects will show up here once added from the dashboard.</p>
        </div>
      </div>
    </section>

    <!-- ============ EXPERIENCE + EDUCATION ============ -->
    <section id="experience" class="section section--elev">
      <div class="container timeline-grid">
        <div>
          <div class="section-head">
            <p class="eyebrow">04 / experience</p>
            <h2 class="section-title">Where I've worked</h2>
          </div>
          <ol class="timeline">
            <li v-for="e in experience" :key="e.id" class="timeline__item">
              <p class="timeline__date mono">{{ formatRange(e.start_date, e.end_date) }}</p>
              <h3 class="timeline__title">{{ e.position }} · {{ e.company }}</h3>
              <p class="timeline__desc">{{ e.description }}</p>
            </li>
            <p v-if="!experience.length" class="empty-note">Experience entries will show up here once added.</p>
          </ol>
        </div>

        <div>
          <div class="section-head">
            <p class="eyebrow">education</p>
            <h2 class="section-title">Where I've studied</h2>
          </div>
          <ol class="timeline">
            <li v-for="ed in education" :key="ed.id" class="timeline__item">
              <p class="timeline__date mono">{{ formatRange(ed.start_date, ed.end_date) }}</p>
              <h3 class="timeline__title">{{ ed.degree }} · {{ ed.school }}</h3>
              <p class="timeline__desc">{{ ed.field_of_study }}</p>
            </li>
            <p v-if="!education.length" class="empty-note">Education entries will show up here once added.</p>
          </ol>
        </div>
      </div>
    </section>

    <!-- ============ CONTACT ============ -->
    <section id="contact" class="section">
      <div class="container contact__wrap">
        <div class="section-head">
          <p class="eyebrow">05 / contact</p>
          <h2 class="section-title">Let's work together</h2>
          <p class="contact__intro">Have a project in mind or just want to say hello? Send a message below.</p>
        </div>

        <form class="contact__form" @submit.prevent="submitMessage" novalidate>
          <div class="contact__row">
            <BaseInput v-model="form.name" label="Name" required :error="errors.name" />
            <BaseInput v-model="form.email" label="Email" type="email" required :error="errors.email" />
          </div>
          <BaseInput v-model="form.subject" label="Subject" />
          <BaseTextarea v-model="form.message" label="Message" required :error="errors.message" />
          <BaseButton type="submit" variant="primary" :loading="sending" loading-text="sending…" label="send message" />
        </form>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer__inner">
        <p class="mono">© {{ new Date().getFullYear() }} {{ profile.full_name || 'Portfolio' }}</p>
        <div class="footer__social">
          <a v-if="profile.github_url" :href="profile.github_url" target="_blank">
            <i class="bi bi-github" aria-hidden="true"></i>
            GitHub
          </a>
          <a v-if="profile.linkedin_url" :href="profile.linkedin_url" target="_blank">
            <i class="bi bi-linkedin" aria-hidden="true"></i>
            LinkedIn
          </a>
          <a v-if="profile.facebook_url" :href="profile.facebook_url" target="_blank">
            <i class="bi bi-facebook" aria-hidden="true"></i>
            Facebook
          </a>
          <a v-if="profile.resume_url" :href="profile.resume_url" target="_blank">
            <i class="bi bi-file-earmark-person" aria-hidden="true"></i>
            Resume
          </a>
          <router-link to="/admin/login">
            <i class="bi bi-shield-lock" aria-hidden="true"></i>
            Admin
          </router-link>
        </div>
      </div>
    </footer>

    <!-- ============ PROJECT DETAIL MODAL ============ -->
    <BaseModal v-model="showProjectDetail" :title="viewingProject?.title || ''" size="lg">
      <div v-if="viewingProject" class="detail">
        <div v-if="viewingProject.image_url" class="detail__image">
          <img :src="mediaUrl(viewingProject.image_url)" :alt="viewingProject.title" @error="onImageError" />
        </div>
        <p class="detail__desc">{{ viewingProject.description || 'No description provided.' }}</p>
        <div class="detail__tech">
          <span v-for="t in techList(viewingProject.tech_stack)" :key="t" class="badge">{{ t }}</span>
        </div>
      </div>
      <template #footer>
        <a v-if="viewingProject?.demo_url" :href="viewingProject.demo_url" target="_blank" class="btn btn-primary">live
          demo</a>
        <a v-if="viewingProject?.repo_url" :href="viewingProject.repo_url" target="_blank" class="btn">source</a>
        <button type="button" class="btn" @click="showProjectDetail = false">close</button>
      </template>
    </BaseModal>

    <!-- ============ PROFILE DETAIL MODAL ============ -->
    <BaseModal v-model="showProfileDetail" :title="profile.full_name || ''">
      <div class="detail">
        <div v-if="profile.avatar_url" class="detail__avatar">
          <img :src="mediaUrl(profile.avatar_url)" :alt="profile.full_name" @error="onImageError" />
        </div>
        <p class="detail__title-line">{{ profile.title }}</p>
        <p class="detail__desc">{{ profile.about_text }}</p>
        <dl class="detail__meta">
          <div v-if="profile.location">
            <dt>Location</dt>
            <dd>{{ profile.location }}</dd>
          </div>
          <div v-if="profile.email">
            <dt>Email</dt>
            <dd>{{ profile.email }}</dd>
          </div>
          <div v-if="profile.phone">
            <dt>Phone</dt>
            <dd>{{ profile.phone }}</dd>
          </div>
        </dl>
      </div>
      <template #footer>
        <a href="#contact" class="btn btn-primary" @click="showProfileDetail = false">get in touch</a>
        <button type="button" class="btn" @click="showProfileDetail = false">close</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import SiteNavbar from '../../components/SiteNavbar.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import profileService from '../../services/profileService'
import projectService from '../../services/projectService'
import skillService from '../../services/skillService'
import experienceService from '../../services/experienceService'
import educationService from '../../services/educationService'
import messageService from '../../services/messageService'
import { useToastStore } from '../../stores/toastStore'
import { validate, isRequired, isEmail, minLength } from '../../utils/validators'
import { onImageError } from '../../utils/imageFallback.js'
import { resolveMediaUrl } from '../../utils/apiUrls'

const toast = useToastStore()

function mediaUrl(path) {
  return resolveMediaUrl(path)
}

const profile = ref({})
const projects = ref([])
const skills = ref([])
const experience = ref([])
const education = ref([])

const showProjectDetail = ref(false)
const viewingProject = ref(null)
const showProfileDetail = ref(false)

function openProjectDetail(p) {
  viewingProject.value = p
  showProjectDetail.value = true
}

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({})
const sending = ref(false)

function techList(str) {
  if (!str) return []
  return str.split(',').map((t) => t.trim()).filter(Boolean)
}

function formatRange(start, end) {
  const opts = { year: 'numeric', month: 'short' }
  const s = start ? new Date(start).toLocaleDateString('en-US', opts) : ''
  const e = end ? new Date(end).toLocaleDateString('en-US', opts) : 'Present'
  return `${s} — ${e}`
}

function validateForm() {
  const result = validate(form, {
    name: [[isRequired, 'Please enter your name.']],
    email: [
      [isRequired, 'Please enter your email.'],
      [isEmail, 'Please enter a valid email address.']
    ],
    message: [
      [isRequired, 'Please enter a message.'],
      [(v) => minLength(v, 10), 'Message should be at least 10 characters.']
    ]
  })
  Object.keys(errors).forEach((k) => delete errors[k])
  Object.assign(errors, result)
  return Object.keys(result).length === 0
}

async function submitMessage() {
  if (!validateForm()) return
  sending.value = true
  try {
    await messageService.send({ ...form })
    toast.success("Message sent — thank you! I'll get back to you soon.")
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not send your message. Please try again.')
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  try {
    const [p, pr, sk, ex, ed] = await Promise.all([
      profileService.get(),
      projectService.getAll(),
      skillService.getAll(),
      experienceService.getAll(),
      educationService.getAll()
    ])
    profile.value = p.data || {}
    projects.value = pr.data || []
    skills.value = sk.data || []
    experience.value = ex.data || []
    education.value = ed.data || []
  } catch (err) {
    console.error('Failed to load portfolio data', err)
  }
})
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 72px;
  background:
    radial-gradient(circle at 15% 20%, rgba(94, 234, 212, 0.06), transparent 40%),
    radial-gradient(circle at 85% 60%, rgba(240, 180, 41, 0.05), transparent 45%);
}

.hero__inner {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: var(--space-8);
  align-items: center;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3.4rem);
  margin-top: var(--space-4);
}

.hero__accent {
  color: var(--accent);
}

.hero__avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent);
  margin-bottom: var(--space-5);
  box-shadow: 0 0 0 6px var(--accent-soft), 0 12px 30px rgba(0, 0, 0, 0.35);
  padding: 0;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.hero__avatar::after {
  content: '↗ view profile';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 8, 14, 0.75);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  text-align: center;
  padding: var(--space-2);
}

.hero__avatar:hover {
  transform: scale(1.04);
  box-shadow: 0 0 0 8px var(--accent-soft), 0 16px 36px rgba(0, 0, 0, 0.4);
}

.hero__avatar:hover::after {
  opacity: 1;
}

.hero__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__image,
.detail__avatar {
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--space-5);
  max-height: 280px;
}

.detail__avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  max-height: none;
  border: 2px solid var(--accent);
}

.detail__image img,
.detail__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__title-line {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin-bottom: var(--space-4);
}

.detail__desc {
  color: var(--text-dim);
  margin-bottom: var(--space-4);
  line-height: 1.6;
  white-space: pre-wrap;
}

.detail__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.detail__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.detail__meta>div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  border-top: 1px solid var(--border);
  padding-top: var(--space-3);
}

.detail__meta dt {
  color: var(--text-faint);
  font-size: 0.78rem;
  font-family: var(--font-mono);
}

.detail__meta dd {
  margin: 0;
  font-size: 0.88rem;
}

.hero__tagline {
  color: var(--text-dim);
  font-size: 1.1rem;
  margin-top: var(--space-5);
  max-width: 480px;
}

.hero__actions {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.hero__terminal {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.term__bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-elev-2);
  border-bottom: 1px solid var(--border);
}

.term__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.term__dot--r {
  background: #f87171;
}

.term__dot--y {
  background: #f0b429;
}

.term__dot--g {
  background: #4ade80;
}

.term__filename {
  margin-left: var(--space-3);
  color: var(--text-faint);
  font-size: 0.78rem;
}

.term__body {
  padding: var(--space-5);
  font-size: 0.9rem;
  min-height: 220px;
}

.term__body p {
  margin-bottom: var(--space-3);
}

.term__prompt {
  color: var(--accent);
  margin-right: var(--space-2);
}

.term__out {
  color: var(--text-dim);
  padding-left: 1.2rem;
}

.term__cursor {
  display: inline-block;
  animation: blink 1s step-end infinite;
  color: var(--accent);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.section--elev {
  background: var(--bg-elev);
}

.about__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--space-7);
}

.about__text {
  color: var(--text-dim);
  font-size: 1.05rem;
  max-width: 640px;
}

.about__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  font-size: 0.85rem;
}

.about__meta li {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.about__meta span {
  color: var(--text-faint);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.skills__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-4);
}

.skill-card {
  padding: var(--space-4);
}

.skill-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.skill-card__name {
  font-size: 0.95rem;
}

.skill-card__bar {
  height: 6px;
  background: var(--bg-elev-2);
  border-radius: 999px;
  overflow: hidden;
}

.skill-card__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-5);
}

.project-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
}

.project-card__image {
  height: 180px;
  overflow: hidden;
  background: var(--bg-elev-2);
}

.project-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-card__body {
  padding: var(--space-5);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-card__title {
  font-size: 1.1rem;
  margin-bottom: var(--space-2);
}

.project-card__desc {
  color: var(--text-dim);
  font-size: 0.9rem;
  flex: 1;
  margin-bottom: var(--space-4);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.project-card__links {
  display: flex;
  gap: var(--space-3);
}

.timeline-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}

.timeline__item {
  border-left: 2px solid var(--border);
  padding: 0 0 var(--space-6) var(--space-5);
  position: relative;
}

.timeline__item::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.timeline__date {
  color: var(--text-faint);
  font-size: 0.78rem;
  margin-bottom: var(--space-2);
}

.timeline__title {
  font-size: 1rem;
  margin-bottom: var(--space-2);
}

.timeline__desc {
  color: var(--text-dim);
  font-size: 0.9rem;
}

.contact__wrap {
  max-width: 640px;
}

.contact__intro {
  color: var(--text-dim);
  margin-top: var(--space-3);
}

.contact__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.contact__row > * {
  min-width: 0;
}

:deep(.field-invalid) {
  border-color: var(--danger) !important;
}

.empty-note {
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.footer {
  border-top: 1px solid var(--border);
  padding: var(--space-6) 0;
}

.footer__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-faint);
  font-size: 0.85rem;
}

.footer__social {
  display: flex;
  gap: var(--space-5);
}

.footer__social a {
  color: var(--text-dim);
}

.footer__social a:hover {
  color: var(--accent);
}

@media (max-width: 900px) {
  .hero__inner {
    grid-template-columns: 1fr;
  }

  .about__grid {
    grid-template-columns: 1fr;
  }

  .timeline-grid {
    grid-template-columns: 1fr;
  }

  .contact__row {
    grid-template-columns: 1fr;
  }
}
</style>
