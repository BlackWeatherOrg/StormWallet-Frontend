<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '../components/Appheader.vue'
import Appfooter from '@/components/Appfooter.vue'
const userData = ref({
  username: 'ИванПетров',
  email: 'ivan@example.com',
  registrationDate: '2023-10-15T14:48:00.000Z',
})

function getRandomColor() {
  const colors = [
    '#3b82f6', 
    '#ef4444', 
    '#10b981',
    '#f59e0b', 
    '#8b5cf6', 
    '#ec4899', 
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
const userAvatar = ref('')
const formattedDate = ref('')

onMounted(() => {
  if (userData.value.username) {
    userAvatar.value = userData.value.username.charAt(0).toUpperCase()
  }
  if (userData.value.registrationDate) {
    const date = new Date(userData.value.registrationDate)
    formattedDate.value = date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
})
</script>

<template>
  <div class="profile-page">
    <AppHeader />
    <main class="profile-container">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar" :style="{ backgroundColor: getRandomColor() }">
            {{ userAvatar }}
          </div>
          <h1 class="username">{{ userData.username }}</h1>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ userData.email }}</span>
          </div>

          <div class="detail-item">
            <span class="detail-label">Дата регистрации:</span>
            <span class="detail-value">{{ formattedDate }}</span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="action-button edit-button">Редактировать профиль</button>
          <button class="action-button logout-button">Выйти</button>
        </div>
      </div>
    </main>
    <!-- <Appfooter /> -->
  </div>
</template>

<style>
.profile-page {
  min-height: 100vh;
  background-color: #111827;
  color: #f3f4f6;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 6rem;
}

.profile-card {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 2.5rem;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1.5rem;
}

.username {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: #60a5fa;
}

.profile-details {
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #374151;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  color: #9ca3af;
  font-weight: 500;
}

.detail-value {
  color: #f3f4f6;
  font-weight: 400;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.edit-button:hover {
  background-color: #2563eb;
}

.logout-button {
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.logout-button:hover {
  background-color: rgba(239, 68, 68, 0.1);
}
</style>
