<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/Appheader.vue'
import Appfooter from '@/components/Appfooter.vue'
const selectedDate = ref(new Date().toISOString().split('T')[0])
const operations = ref([])
const newOperation = ref({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
})
const categories = ref([
  'Еда',
  'Транспорт',
  'Жилье',
  'Развлечения',
  'Здоровье',
  'Одежда',
  'Образование',
  'Другое',
])
const incomeCategories = ref(['Зарплата', 'Подарок', 'Инвестиции', 'Возврат', 'Другое'])
const editingId = ref(null)
const showForm = ref(false)

const filteredOperations = computed(() => {
  return operations.value.filter((op) => op.date === selectedDate.value)
})

const totalExpenses = computed(() => {
  return filteredOperations.value
    .filter((op) => op.type === 'expense')
    .reduce((sum, op) => sum + parseFloat(op.amount), 0)
})

const totalIncome = computed(() => {
  return filteredOperations.value
    .filter((op) => op.type === 'income')
    .reduce((sum, op) => sum + parseFloat(op.amount), 0)
})

const dailyBalance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const saveOperation = () => {
  if (!newOperation.value.amount || !newOperation.value.category) return

  if (editingId.value) {
    const index = operations.value.findIndex((op) => op.id === editingId.value)
    if (index !== -1) {
      operations.value[index] = {
        ...newOperation.value,
        id: editingId.value,
        date: selectedDate.value,
      }
    }
  } else {
    operations.value.push({
      id: Date.now(),
      date: selectedDate.value,
      ...newOperation.value,
    })
  }

  resetForm()
}

const editOperation = (operation) => {
  newOperation.value = { ...operation }
  editingId.value = operation.id
  showForm.value = true
}

const deleteOperation = (id) => {
  operations.value = operations.value.filter((op) => op.id !== id)
}

const resetForm = () => {
  newOperation.value = {
    type: 'expense',
    amount: '',
    category: '',
    description: '',
  }
  editingId.value = null
  showForm.value = false
}

onMounted(() => {
  operations.value = [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      amount: '1500',
      category: 'Еда',
      description: 'Продукты на неделю',
    },
    {
      id: 2,
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      amount: '50000',
      category: 'Зарплата',
      description: 'Зарплата за месяц',
    },
  ]
})
</script>

<template>
  <div class="dashboard-page">
    <AppHeader />

    <main class="dashboard-container">
      <div class="date-selector">
        <input type="date" v-model="selectedDate" class="date-input" />
        <button @click="showForm = true" class="add-button">+ Добавить операцию</button>
      </div>

      <div class="daily-stats">
        <div class="stat-card income">
          <h3>Доходы</h3>
          <p class="amount">{{ totalIncome }} ₽</p>
        </div>
        <div class="stat-card expense">
          <h3>Расходы</h3>
          <p class="amount">{{ totalExpenses }} ₽</p>
        </div>
        <div class="stat-card balance">
          <h3>Баланс</h3>
          <p class="amount">{{ dailyBalance }} ₽</p>
        </div>
      </div>

      <div v-if="showForm" class="operation-form">
        <h2>{{ editingId ? 'Редактировать операцию' : 'Добавить операцию' }}</h2>

        <div class="formm-group">
          <label>Тип операции</label>
          <div class="type-selector">
            <button
              @click="newOperation.type = 'income'"
              :class="{ active: newOperation.type === 'income' }"
            >
              Доход
            </button>
            <button
              @click="newOperation.type = 'expense'"
              :class="{ active: newOperation.type === 'expense' }"
            >
              Расход
            </button>
          </div>
        </div>

        <div class="formm-group">
          <label>Сумма (₽)</label>
          <input type="number" v-model="newOperation.amount" placeholder="Введите сумму" />
        </div>

        <div class="formm-group">
          <label>Категория</label>
          <select v-model="newOperation.category">
            <option value="" disabled>Выберите категорию</option>
            <option
              v-for="category in newOperation.type === 'income' ? incomeCategories : categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div class="formm-group">
          <label>Описание (необязательно)</label>
          <input type="text" v-model="newOperation.description" placeholder="Краткое описание" />
        </div>

        <div class="form-actions">
          <button @click="resetForm" class="cancel-button">Отмена</button>
          <button @click="saveOperation" class="save-button">
            {{ editingId ? 'Обновить' : 'Сохранить' }}
          </button>
        </div>
      </div>

      <div class="operations-list">
        <h2>Операции за {{ new Date(selectedDate).toLocaleDateString('ru-RU') }}</h2>

        <div v-if="filteredOperations.length === 0" class="empty-state">
          <p>Нет операций за выбранную дату</p>
        </div>

        <div v-else>
          <div
            v-for="operation in filteredOperations"
            :key="operation.id"
            class="operation-item"
            :class="operation.type"
          >
            <div class="operation-info">
              <span class="category">{{ operation.category }}</span>
              <span class="description">{{ operation.description }}</span>
            </div>
            <div class="operation-amount">
              {{ operation.type === 'expense' ? '-' : '+' }}{{ operation.amount }} ₽
            </div>
            <div class="operation-actions">
              <button @click="editOperation(operation)" class="edit-button">✏️</button>
              <button @click="deleteOperation(operation.id)" class="delete-button">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- <Appfooter /> -->
  </div>
</template>

<style>
.dashboard-page {
  min-height: 100vh;
  background-color: #111827;
  color: #f3f4f6;
}

.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 6rem;
}

.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.date-input {
  padding: 0.75rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  color: #f3f4f6;
  font-size: 1rem;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #2563eb;
}

.daily-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  color: #9ca3af;
  font-size: 1rem;
}

.stat-card .amount {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0;
}

.income .amount {
  color: #10b981;
}

.expense .amount {
  color: #ef4444;
}

.balance .amount {
  color: #60a5fa;
}

.operation-form {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.operation-form h2 {
  margin-top: 0;
  color: #60a5fa;
}

.formm-group {
  margin-bottom: 1rem;
}

.formm-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #d1d5db;
}
.formm-group input,
.formm-group select {
  width: 100%;
  padding: 0.75rem;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: #f3f4f6;
  font-size: 1rem;
}
.formm-group input{
    width: 96.5%;
}
.type-selector {
  display: flex;
  gap: 0.5rem;
}

.type-selector button {
  flex: 1;
  padding: 0.75rem;
  background-color: #374151;
  border: none;
  border-radius: 0.375rem;
  color: #f3f4f6;
  cursor: pointer;
}

.type-selector button.active {
  background-color: #3b82f6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: #f3f4f6;
  cursor: pointer;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  border: none;
  border-radius: 0.375rem;
  color: white;
  cursor: pointer;
}

.operations-list h2 {
  color: #60a5fa;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.operation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
}

.operation-info {
  flex: 1;
}

.operation-info .category {
  display: block;
  font-weight: 500;
}

.operation-info .description {
  display: block;
  font-size: 0.875rem;
  color: #9ca3af;
}

.operation-amount {
  font-weight: 600;
  margin: 0 1rem;
}

.operation-amount.income {
  color: #10b981;
}

.operation-amount.expense {
  color: #ef4444;
}

.operation-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-button,
.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
}

.edit-button:hover {
  color: #3b82f6;
}

.delete-button:hover {
  color: #ef4444;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
    padding-top: 5rem;
  }

  .daily-stats {
    grid-template-columns: 1fr;
  }

  .date-selector {
    flex-direction: column;
    gap: 1rem;
  }

  .date-input,
  .add-button {
    width: 100%;
  }
}
</style>
