<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
const isMobileMenuOpen = ref(false)

const navItems = computed(() => {
  const items = [
    { title: 'О нас', path: '/about' },
    { title: 'Статистика', path: '/statistics' },
    { title: 'Финансы', path: '/work' },
    { title: 'Профиль', path: '/profile' },
  ]
  if (userStore.isAuth) {
    return items
  }
  return []
})

const authItem = computed(() => {
  return userStore.isAuth
    ? {
        title: 'Выйти',
        path: '/auth',
        action: () => {
          localStorage.removeItem('token')
          userStore.setIsAuth(false)
        },
      }
    : { title: 'Войти', path: '/auth' }
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleAuthClick = (item) => {
  if (item.action) {
    item.action()
  }
  closeMobileMenu()
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <RouterLink to="/" class="logo">
        <div class="logo-icon">S</div>
        <span class="logo-text">StormWallet</span>
      </RouterLink>
      <nav class="nav-desktop" v-if="userStore.isAuth">
        <ul class="nav-list">
          <li v-for="(item, index) in navItems" :key="index">
            <RouterLink
              :to="item.path"
              class="nav-link"
              active-class="active"
              @click="closeMobileMenu"
            >
              {{ item.title }}
              <span class="link-underline"></span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="authItem.path" class="nav-link" @click="handleAuthClick(authItem)">
              {{ authItem.title }}
              <span class="link-underline"></span>
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div v-else class="auth-link-desktop">
        <RouterLink :to="authItem.path" class="nav-link" @click="handleAuthClick(authItem)">
          {{ authItem.title }}
          <span class="link-underline"></span>
        </RouterLink>
      </div>
      <button
        class="burger-btn"
        @click="toggleMobileMenu"
        :class="{ open: isMobileMenuOpen }"
        aria-label="Меню"
      >
        <span class="burger-line"></span>
        <span class="burger-line"></span>
        <span class="burger-line"></span>
      </button>

      <transition name="slide">
        <nav class="nav-mobile" v-show="isMobileMenuOpen" @click="closeMobileMenu">
          <ul class="nav-list-mobile">
            <li v-for="(item, index) in navItems" :key="index">
              <RouterLink
                :to="item.path"
                class="nav-link-mobile"
                active-class="active-mobile"
                @click="closeMobileMenu"
              >
                {{ item.title }}
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="authItem.path"
                class="nav-link-mobile"
                @click="handleAuthClick(authItem)"
              >
                {{ authItem.title }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </transition>
    </div>
  </header>
</template>

<style>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f3f4f6;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.logo-icon {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 0.5rem;
}

.auth-link-desktop {
  margin-left: auto;
}

.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  position: relative;
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #60a5fa;
}

.link-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.nav-link:hover .link-underline,
.nav-link.active .link-underline {
  width: 100%;
}

.nav-link.active {
  color: #60a5fa;
}

.burger-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.625rem;
  z-index: 1001;
}

.burger-line {
  display: block;
  width: 1.5rem;
  height: 2px;
  background-color: #f3f4f6;
  margin: 0.3rem 0;
  transition: all 0.3s ease;
}

.burger-btn.open .burger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.burger-btn.open .burger-line:nth-child(2) {
  opacity: 0;
}

.burger-btn.open .burger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.nav-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(17, 24, 39, 0.98);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.nav-list-mobile {
  list-style: none;
  text-align: center;
  padding: 0;
  margin: 0;
}

.nav-link-mobile {
  display: block;
  padding: 1.25rem;
  font-size: 1.25rem;
  color: #e5e7eb;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link-mobile:hover,
.nav-link-mobile.active-mobile {
  color: #60a5fa;
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .nav-desktop,
  .auth-link-desktop {
    display: none;
  }

  .burger-btn {
    display: block;
  }

  .header-container {
    padding: 0 1rem;
  }
}
</style>
