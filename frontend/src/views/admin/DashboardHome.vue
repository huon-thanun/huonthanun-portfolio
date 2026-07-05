<template>
  <div>
    <header class="page-head">
      <p class="eyebrow">overview</p>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-sub">A quick summary of everything in your portfolio.</p>
    </header>

    <div class="stats-grid">
      <div class="stat-card card">
        <p class="stat-card__label mono">Projects</p>
        <p class="stat-card__value">{{ stats.projects ?? '—' }}</p>
      </div>
      <div class="stat-card card">
        <p class="stat-card__label mono">Skills</p>
        <p class="stat-card__value">{{ stats.skills ?? '—' }}</p>
      </div>
      <div class="stat-card card">
        <p class="stat-card__label mono">Experience</p>
        <p class="stat-card__value">{{ stats.experience ?? '—' }}</p>
      </div>
      <div class="stat-card card">
        <p class="stat-card__label mono">Education</p>
        <p class="stat-card__value">{{ stats.education ?? '—' }}</p>
      </div>
      <div class="stat-card card">
        <p class="stat-card__label mono">Messages</p>
        <p class="stat-card__value">{{ stats.messages ?? '—' }}</p>
      </div>
      <div class="stat-card card stat-card--accent">
        <p class="stat-card__label mono">Unread</p>
        <p class="stat-card__value">{{ stats.unreadMessages ?? '—' }}</p>
      </div>
    </div>

    <div class="chart-card card">
      <p class="eyebrow">content breakdown</p>
      <h2 class="chart-title">Portfolio content by type</h2>
      <div class="chart-wrap">
        <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'
import profileService from '../../services/profileService'

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)

const emit = defineEmits(['stats-updated'])
const stats = ref({})

const chartData = computed(() => {
  if (!stats.value.projects && stats.value.projects !== 0) return null
  return {
    labels: ['Projects', 'Skills', 'Experience', 'Education', 'Messages'],
    datasets: [
      {
        label: 'Count',
        backgroundColor: '#5eead4',
        borderRadius: 6,
        data: [
          stats.value.projects,
          stats.value.skills,
          stats.value.experience,
          stats.value.education,
          stats.value.messages
        ]
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { color: '#8b98a8' }, grid: { color: '#232c3a' } },
    y: { ticks: { color: '#8b98a8', stepSize: 1 }, grid: { color: '#232c3a' }, beginAtZero: true }
  }
}

async function fetchStats() {
  try {
    const { data } = await profileService.getStats()
    stats.value = data
    emit('stats-updated')
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchStats)
</script>

<style scoped>
.page-head {
  margin-bottom: var(--space-7);
}

.page-title {
  font-size: 1.8rem;
  margin-top: var(--space-2);
}

.page-sub {
  color: var(--text-dim);
  margin-top: var(--space-2);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-7);
}

.stat-card {
  padding: var(--space-5);
}

.stat-card__label {
  color: var(--text-dim);
  font-size: 0.78rem;
  text-transform: uppercase;
}

.stat-card__value {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-top: var(--space-2);
}

.stat-card--accent .stat-card__value {
  color: var(--danger);
}

.chart-card {
  padding: var(--space-6);
}

.chart-title {
  margin-top: var(--space-2);
  margin-bottom: var(--space-5);
  font-size: 1.2rem;
}

.chart-wrap {
  height: 320px;
}
</style>
