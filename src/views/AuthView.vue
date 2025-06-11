<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/Appheader.vue'
import Appfooter from '@/components/Appfooter.vue'
import { registration, login } from '@/http/userAPI'
import { useUserStore } from '@/stores/UserStore'

const router = useRouter()
const userStore = useUserStore()

const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const toggleAuthMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMessage.value = ''
}

const validateForm = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return false
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Пароль должен содержать минимум 6 символов'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    if (isLoginMode.value) {
      const userData = await login(email.value, password.value)
      userStore.setIsAuth(true)
      userStore.setUser(userData)
      userStore.setUserId(userData.id)
      userStore.setIsEmail(email.value)
    } else {
      await registration(email.value, password.value)
      const userData = await login(email.value, password.value) 
      userStore.setIsAuth(true)
      userStore.setUser(userData)
      userStore.setUserId(userData.id)
      userStore.setIsEmail(email.value)
    }
    router.push('/')
  } catch (error) {
    console.error('Ошибка аутентификации:', error)
    errorMessage.value = isLoginMode.value
      ? 'Неверный email или пароль'
      : error.response?.data?.message || 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <AppHeader />

    <main class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">{{ isLoginMode ? 'Вход в StormWallet' : 'Регистрация' }}</h1>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              type="email"
              v-model="email"
              class="form-input"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Пароль</label>
            <input
              id="password"
              type="password"
              v-model="password"
              class="form-input"
              placeholder="Не менее 6 символов"
              required
            />
          </div>
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button type="submit" class="auth-button" :disabled="isLoading">
            <span v-if="!isLoading">
              {{ isLoginMode ? 'Войти' : 'Зарегистрироваться' }}
            </span>
            <span v-else class="loading-spinner"></span>
          </button>
        </form>

        <div class="auth-footer">
          <p class="auth-mode-text">
            {{ isLoginMode ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?' }}
            <button @click="toggleAuthMode" class="mode-toggle-button">
              {{ isLoginMode ? 'Зарегистрироваться' : 'Войти' }}
            </button>
          </p>
        </div>
      </div>
    </main>
    <Appfooter />
  </div>
</template>

<style>
.auth-page {
  min-height: 100vh;
  background-color: #111827;
  color: #f3f4f6;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
}

.auth-card {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  color: #60a5fa;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
}

.form-input {
  padding: 0.75rem 1rem;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: #f3f4f6;
  font-size: 1rem;
  transition: border-color 0.2s;
  max-width: 95%;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-input::placeholder {
  color: #9ca3af;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-top: -0.5rem;
}

.auth-button {
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  height: 46px;
}

.auth-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.auth-button:disabled {
  background-color: #1e40af;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-mode-text {
  color: #9ca3af;
  font-size: 0.875rem;
}

.mode-toggle-button {
  background: none;
  border: none;
  color: #60a5fa;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.25rem;
}

.mode-toggle-button:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
