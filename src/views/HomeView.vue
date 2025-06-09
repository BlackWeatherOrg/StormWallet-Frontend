<script setup>
import { ref } from 'vue'
import Appfooter from '@/components/Appfooter.vue'
const features = ref([
  {
    title: 'Полный контроль',
    description: 'Управляйте своими финансами из одного места',
    icon: '📊',
  },
  {
    title: 'Безопасность',
    description: 'Передовые технологии защиты ваших средств',
    icon: '🔒',
  },
  {
    title: 'Простота',
    description: 'Интуитивно понятный интерфейс для каждого',
    icon: '✨',
  },
])
</script>

<template>
  <div class="page-container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">S</div>
          <span class="logo-text">StormWallet</span>
        </div>
        <router-link to="/auth" class="auth-buttonn"> Войти </router-link>
      </div>
    </header>
    <main class="main-content">
      <section class="hero-section">
        <h1 class="hero-title">Контроль над вашими <span class="highlight">финансами</span></h1>
        <p class="hero-description">
          StormWallet — это современное решение для управления вашими деньгами. Простота,
          безопасность и полный контроль в одном месте.
        </p>

        <div class="action-buttons">
          <router-link to="/auth" class="primary-button"> Начать сейчас </router-link>
          <router-link to="/about" class="secondary-button"> Узнать больше </router-link>
        </div>
      </section>
      <section class="features-section">
        <div class="features-grid">
          <div v-for="(feature, index) in features" :key="index" class="feature-card">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </section>
    </main>
    <Appfooter />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #111827;
  color: #f3f4f6;
}

.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  padding: 2rem 0;
}

.header-content {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: bold;
}

.auth-buttonn {
  padding: 0.5rem 1.5rem;
  background-color: #2563eb;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  text-decoration: none;
  color: white;
}

.auth-buttonn:hover {
  background-color: #1d4ed8;
}

.main-content {
  flex: 1;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 0;
}

.hero-section {
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1.25;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #60a5fa;
}

.hero-description {
  font-size: 1.25rem;
  color: #9ca3af;
  margin-bottom: 3rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.primary-button {
  padding: 0.75rem 2rem;
  background-color: #2563eb;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  text-decoration: none;
  color: white;
}

.primary-button:hover {
  background-color: #1d4ed8;
}

.secondary-button {
  padding: 0.75rem 2rem;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
  background-color: transparent;
  color: white;
}

.secondary-button:hover {
  background-color: #1f2937;
}

.features-section {
  margin-top: 8rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  background-color: #1f2937;
  padding: 2rem;
  border-radius: 0.75rem;
  transition: background-color 0.2s;
}

.feature-card:hover {
  background-color: #374151;
}

.feature-icon {
  font-size: 2.25rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: #9ca3af;
}
</style>
