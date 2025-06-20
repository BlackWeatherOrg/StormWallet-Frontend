<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '../components/Appheader.vue'
import { check } from '@/http/userAPI'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
const router = useRouter()

const userStore = useUserStore()
const userData = ref({
  username: '',
  email: '',
  registrationDate: '',
})
const isLoading = ref(true)
const error = ref(null)

const userAvatar = ref('')
const formattedDate = ref('')

function getRandomColor() {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
  return colors[Math.floor(Math.random() * colors.length)]
}

const Logout = () => {
  userStore.setIsAuth(false)
  localStorage.removeItem('token');
  router.push('/')
}

const loadUserData = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await check()

    if (!response) throw new Error('Данные пользователя не получены')

    userData.value = {
      username: response.email.split('@')[0],
      email: response.email,
      registrationDate: response.CreatedAt,
    }

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
  } catch (err) {
    console.error('Ошибка загрузки данных:', err)
    error.value = 'Не удалось загрузить данные профиля'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <div class="profile-page">
    <AppHeader />
    <main class="profile-container">
      <div v-if="isLoading" class="loading-state">Загрузка данных профиля...</div>

      <div v-else-if="error" class="error-state">
        {{ error }}
        <button @click="loadUserData" class="retry-button">Повторить попытку</button>
      </div>

      <div v-else class="profile-card">
        <div class="profile-header">
          <div class="avatar" :style="{ backgroundColor: getRandomColor() }">
            {{ userAvatar }}
          </div>
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
          <button class="action-button logout-button" @click="Logout">Выйти</button>
        </div>
      </div>
    </main>
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

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  background-color: #1f2937;
  border-radius: 0.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.error-state {
  color: #ef4444;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #2563eb;
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
