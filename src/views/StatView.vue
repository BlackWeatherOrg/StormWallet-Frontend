<script setup>
import { ref, computed } from 'vue'
import AppHeader from '../components/Appheader.vue'
import Appfooter from '@/components/Appfooter.vue'
const selectedPeriod = ref('month')

// Моковые данные
const operations = ref([
  {
    id: 1,
    date: '2023-11-01',
    type: 'income',
    amount: '50000',
    category: 'Зарплата',
    description: 'Зарплата за октябрь',
  },
  {
    id: 2,
    date: '2023-11-02',
    type: 'expense',
    amount: '1500',
    category: 'Еда',
    description: 'Продукты',
  },
  {
    id: 3,
    date: '2023-11-05',
    type: 'expense',
    amount: '3000',
    category: 'Транспорт',
    description: 'Бензин',
  },
  {
    id: 4,
    date: '2023-11-10',
    type: 'income',
    amount: '10000',
    category: 'Фриланс',
    description: 'Проект для клиента',
  },
  {
    id: 5,
    date: '2023-11-15',
    type: 'expense',
    amount: '5000',
    category: 'Развлечения',
    description: 'Кино и ужин',
  },
])

const periods = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
]
const colors = {
  expenses: '#EF4444',
  income: '#10B981',
  categories: [
    '#3B82F6',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
    '#6366F1',
    '#D946EF',
  ],
}

const filteredOperations = computed(() => {
  return operations.value
})

const totalStats = computed(() => {
  const stats = {
    income: 0,
    expenses: 0,
    balance: 0,
    topExpenseCategory: '',
    topIncomeCategory: '',
  }

  const categoryExpenses = {}
  const categoryIncome = {}

  filteredOperations.value.forEach((op) => {
    if (op.type === 'income') {
      stats.income += parseFloat(op.amount)
      categoryIncome[op.category] = (categoryIncome[op.category] || 0) + parseFloat(op.amount)
    } else {
      stats.expenses += parseFloat(op.amount)
      categoryExpenses[op.category] = (categoryExpenses[op.category] || 0) + parseFloat(op.amount)
    }
  })

  stats.balance = stats.income - stats.expenses
  stats.topExpenseCategory =
    Object.keys(categoryExpenses).reduce(
      (a, b) => (categoryExpenses[a] > categoryExpenses[b] ? a : b),
      '',
    ) || 'Нет данных'

  stats.topIncomeCategory =
    Object.keys(categoryIncome).reduce(
      (a, b) => (categoryIncome[a] > categoryIncome[b] ? a : b),
      '',
    ) || 'Нет данных'

  return stats
})

const chartData = computed(() => {
  const dailyData = {}
  const categoryData = { expenses: {}, income: {} }

  operations.value.forEach((op) => {
    if (!dailyData[op.date]) {
      dailyData[op.date] = { income: 0, expenses: 0 }
    }

    if (op.type === 'income') {
      dailyData[op.date].income += parseFloat(op.amount)
      categoryData.income[op.category] =
        (categoryData.income[op.category] || 0) + parseFloat(op.amount)
    } else {
      dailyData[op.date].expenses += parseFloat(op.amount)
      categoryData.expenses[op.category] =
        (categoryData.expenses[op.category] || 0) + parseFloat(op.amount)
    }
  })

  return {
    daily: Object.entries(dailyData).map(([date, values]) => ({
      date,
      income: values.income,
      expenses: values.expenses,
    })),
    categories: {
      expenses: Object.entries(categoryData.expenses).map(([name, value]) => ({
        name,
        value,
      })),
      income: Object.entries(categoryData.income).map(([name, value]) => ({
        name,
        value,
      })),
    },
  }
})

const formatCurrency = (value) => {
  return parseFloat(value).toLocaleString('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
</script>

<template>
  <div class="stats-page">
    <AppHeader />

    <main class="stats-container">
      <h1 class="stats-title">Финансовая статистика</h1>

      <div class="period-selector">
        <label>Период:</label>
        <select v-model="selectedPeriod">
          <option v-for="period in periods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
      </div>

      <div class="summary-cards">
        <div class="summary-card income">
          <h3>Общий доход</h3>
          <p class="amount">{{ formatCurrency(totalStats.income) }} ₽</p>
          <p class="subtext">Основная категория: {{ totalStats.topIncomeCategory }}</p>
        </div>

        <div class="summary-card expense">
          <h3>Общие расходы</h3>
          <p class="amount">{{ formatCurrency(totalStats.expenses) }} ₽</p>
          <p class="subtext">Основная категория: {{ totalStats.topExpenseCategory }}</p>
        </div>

        <div class="summary-card balance" :class="{ negative: totalStats.balance < 0 }">
          <h3>Итоговый баланс</h3>
          <p class="amount">{{ formatCurrency(totalStats.balance) }} ₽</p>
          <p class="subtext">
            {{ totalStats.balance >= 0 ? 'Положительный' : 'Отрицательный' }} баланс
          </p>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-container">
          <h3>Динамика доходов и расходов</h3>
          <div class="chart-placeholder">
            <ul>
              <li v-for="day in chartData.daily" :key="day.date">
                {{ day.date }}: Доходы {{ day.income.toFixed(2) }} ₽, Расходы
                {{ day.expenses.toFixed(2) }} ₽
              </li>
            </ul>
          </div>
        </div>

        <div class="chart-container">
          <h3>Структура расходов</h3>
          <div class="chart-placeholder">
            <ul>
              <li v-for="(cat, index) in chartData.categories.expenses" :key="cat.name">
                <span
                  class="category-color"
                  :style="{ backgroundColor: colors.categories[index] }"
                ></span>
                {{ cat.name }}: {{ formatCurrency(cat.value) }} ₽
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="categories-section">
        <div class="categories-table">
          <h3>Доходы по категориям</h3>
          <table v-if="chartData.categories.income.length > 0">
            <thead>
              <tr>
                <th>Категория</th>
                <th>Сумма</th>
                <th>Доля</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cat, index) in chartData.categories.income" :key="'income-' + cat.name">
                <td>
                  <span
                    class="category-color"
                    :style="{ backgroundColor: colors.categories[index] }"
                  ></span>
                  {{ cat.name }}
                </td>
                <td>{{ formatCurrency(cat.value) }} ₽</td>
                <td>{{ ((cat.value / totalStats.income) * 100 || 0).toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-data">Нет данных о доходах за выбранный период</p>
        </div>

        <div class="categories-table">
          <h3>Расходы по категориям</h3>
          <table v-if="chartData.categories.expenses.length > 0">
            <thead>
              <tr>
                <th>Категория</th>
                <th>Сумма</th>
                <th>Доля</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(cat, index) in chartData.categories.expenses"
                :key="'expense-' + cat.name"
              >
                <td>
                  <span
                    class="category-color"
                    :style="{ backgroundColor: colors.categories[index] }"
                  ></span>
                  {{ cat.name }}
                </td>
                <td>{{ formatCurrency(cat.value) }} ₽</td>
                <td>{{ ((cat.value / totalStats.expenses) * 100 || 0).toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-data">Нет данных о расходах за выбранный период</p>
        </div>
      </div>
    </main>
    <Appfooter />
  </div>
</template>

<style>
.stats-page {
  min-height: 100vh;
  background-color: #111827;
  color: #f3f4f6;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 6rem;
}

.stats-title {
  font-size: 2rem;
  color: #60a5fa;
  margin-bottom: 2rem;
  text-align: center;
}

.period-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.period-selector label {
  font-weight: 500;
}

.period-selector select {
  padding: 0.5rem 1rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  color: #f3f4f6;
  font-size: 1rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.summary-card {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
}

.summary-card h3 {
  margin-top: 0;
  color: #9ca3af;
  font-size: 1.1rem;
}

.summary-card .amount {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 1rem 0;
}

.summary-card .subtext {
  color: #9ca3af;
  font-size: 0.9rem;
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

.balance.negative .amount {
  color: #ef4444;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.chart-container {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.chart-container h3 {
  margin-top: 0;
  color: #60a5fa;
  font-size: 1.25rem;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #9ca3af;
  text-align: center;
}

.chart-placeholder ul {
  text-align: left;
  padding-left: 1.5rem;
}

.chart-placeholder li {
  margin-bottom: 0.5rem;
}

.categories-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.categories-table {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.categories-table h3 {
  margin-top: 0;
  color: #60a5fa;
  font-size: 1.25rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #374151;
}

th {
  color: #9ca3af;
  font-weight: 500;
}

.category-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.no-data {
  color: #9ca3af;
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .stats-container {
    padding: 1rem;
    padding-top: 5rem;
  }

  .summary-cards,
  .charts-section,
  .categories-section {
    grid-template-columns: 1fr;
  }

  .chart-placeholder {
    height: auto;
    padding: 1rem;
  }
}
</style>
