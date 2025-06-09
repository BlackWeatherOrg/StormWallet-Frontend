<script setup></script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <div class="footer-logo-icon">S</div>
        <span class="footer-logo-text">StormWallet</span>
      </div>
      <div class="copyright">© 2025 StormWallet. Все права защищены.</div>
    </div>
  </footer>
</template>

<style>
.footer {
  width: 100%;
  padding: 3rem 0;
  border-top: 1px solid #374151;
  margin-top: 4rem;
}

.footer-content {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-logo-icon {
  width: 1.5rem;
  height: 1.5rem;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.footer-logo-text {
  font-weight: bold;
}

.copyright {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
