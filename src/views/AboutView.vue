<script setup>
import AppHeader from '../components/Appheader.vue'
import Appfooter from '@/components/Appfooter.vue'
</script>

<template>
  <div class="about-page">
    <AppHeader />

    <main class="about-content">
      <section class="about-section">
        <h1 class="about-title">О StormWallet</h1>

        <div class="about-description">
          <p>
            StormWallet — это инновационное решение для управления личными финансами, разработанное
            для тех, кто ценит безопасность, простоту и полный контроль над своими денежными
            потоками.
          </p>

          <p>
            Наш проект объединяет передовые технологии разработки с удобным интерфейсом, предлагая
            пользователям:
          </p>

          <ul class="features-list">
            <li>Мгновенный анализ расходов и доходов</li>
            <li>Надежное шифрование всех финансовых данных</li>
            <li>Кроссплатформенную синхронизацию</li>
            <li>Гибкие инструменты бюджетирования</li>
            <li>Интуитивно понятное управление</li>
          </ul>
        </div>
      </section>

      <section class="team-section">
        <h2 class="team-title">Наша команда</h2>

        <div class="team-members">
          <div class="team-member">
            <div class="member-avatar">ИП</div>
            <h3 class="member-name">Поверинов И.В.</h3>
            <p class="member-role">Frontend-разработчик</p>
            <p class="member-bio">
              Отвечает за пользовательский интерфейс и клиентскую часть приложения
            </p>
          </div>

          <div class="team-member">
            <div class="member-avatar">ДН</div>
            <h3 class="member-name">Наумов Д.А.</h3>
            <p class="member-role">Backend-разработчик</p>
            <p class="member-bio">Отвечает за серверную логику, безопасность и работу с данными</p>
          </div>
        </div>
      </section>

      <section class="mission-section">
        <h2 class="mission-title">Наша миссия</h2>
        <p class="mission-text">
          Мы создаем инструменты, которые дают людям реальный контроль над их финансами, помогая
          принимать обоснованные решения и достигать финансовой стабильности.
        </p>
      </section>
    </main>
    <Appfooter />
  </div>
</template>

<style>
.about-page {
  min-height: 100vh;
  background-color: #111827;
  color: #f3f4f6;
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  padding-top: 6rem;
}

.about-section {
  margin-bottom: 4rem;
}

.about-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #60a5fa;
}

.about-description {
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 800px;
}

.about-description p {
  margin-bottom: 1.5rem;
}

.features-list {
  margin: 1.5rem 0;
  padding-left: 1.5rem;
}

.features-list li {
  margin-bottom: 0.8rem;
  position: relative;
}

.features-list li::before {
  content: '•';
  color: #3b82f6;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.team-section {
  margin: 5rem 0;
}

.team-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  color: #60a5fa;
}

.team-members {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.team-member {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 2rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.member-avatar {
  width: 60px;
  height: 60px;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.member-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.member-role {
  color: #60a5fa;
  font-weight: 500;
  margin-bottom: 1rem;
}

.member-bio {
  color: #d1d5db;
  line-height: 1.6;
}

.mission-section {
  margin-top: 5rem;
  padding: 2rem;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 0.5rem;
  border-left: 4px solid #3b82f6;
}

.mission-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #60a5fa;
}

.mission-text {
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 800px;
}

@media (max-width: 768px) {
  .about-content {
    padding-top: 5rem;
  }

  .about-title {
    font-size: 2rem;
  }

  .team-members {
    grid-template-columns: 1fr;
  }
}
</style>
