<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import AppHeader from '../components/Appheader.vue'
import Appfooter from '@/components/Appfooter.vue'
import { FetchOperationStat } from '@/http/operationAPI'
Chart.register(...registerables)
const selectedPeriod = ref('week')
const customStartDate = ref('')
const customEndDate = ref('')
const showCustomDatePicker = ref(false)
const isLoading = ref(false)
const apiData = ref(null)

const periods = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
  { value: 'custom', label: 'Произвольный период' },
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

let incomeExpenseChart = null
let expensesByCategoryChart = null

const getDateRange = (period) => {
  const now = new Date()
  const start = new Date()

  if (period === 'custom') {
    return {
      start: customStartDate.value,
      end: customEndDate.value,
    }
  }

  switch (period) {
    case 'week':
      start.setDate(now.getDate() - 7)
      break
    case 'month':
      start.setMonth(now.getMonth() - 1)
      break
    case 'quarter':
      start.setMonth(now.getMonth() - 3)
      break
    case 'year':
      start.setFullYear(now.getFullYear() - 1)
      break
    default:
      start.setDate(now.getDate() - 7)
  }

  return {
    start: start.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0],
  }
}

const loadData = async () => {
  try {
    if (selectedPeriod.value === 'custom' && (!customStartDate.value || !customEndDate.value)) {
      return
    }

    isLoading.value = true
    const { start, end } = getDateRange(selectedPeriod.value)

    if (!start || !end) {
      console.error('Не указаны даты начала или конца периода')
      return
    }

    const data = await FetchOperationStat(start, end)
    apiData.value = data
    updateCharts()
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
  } finally {
    isLoading.value = false
  }
}

const handlePeriodChange = () => {
  if (selectedPeriod.value === 'custom') {
    showCustomDatePicker.value = true
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 7)

    customEndDate.value = end.toISOString().split('T')[0]
    customStartDate.value = start.toISOString().split('T')[0]
  } else {
    showCustomDatePicker.value = false
    loadData()
  }
}

const applyCustomDates = () => {
  if (customStartDate.value && customEndDate.value) {
    loadData()
  }
}

const totalStats = computed(() => {
  if (!apiData.value)
    return {
      income: 0,
      expenses: 0,
      balance: 0,
      topExpenseCategory: 'Нет данных',
      topIncomeCategory: 'Нет данных',
    }

  const incomeSum = apiData.value.income_sum || 0
  const expenseSum = apiData.value.expense_sum || 0
  const topExpenseCat = apiData.value.category_expenses?.reduce(
    (prev, current) => (prev.expenses_sum > current.expenses_sum ? prev : current),
    { tag_title: 'Нет данных' },
  )

  const topIncomeCat = apiData.value.category_income?.reduce(
    (prev, current) => (prev.income_sum > current.income_sum ? prev : current),
    { tag_title: 'Нет данных' },
  )

  return {
    income: incomeSum,
    expenses: expenseSum,
    balance: incomeSum - expenseSum,
    topExpenseCategory: topExpenseCat?.tag_title || 'Нет данных',
    topIncomeCategory: topIncomeCat?.tag_title || 'Нет данных',
  }
})

const chartData = computed(() => {
  if (!apiData.value)
    return {
      daily: [],
      categories: {
        expenses: [],
        income: [],
      },
    }
  const dailyData = {}
  apiData.value.operations?.forEach((op) => {
    const date = op.date.split('T')[0]
    if (!dailyData[date]) {
      dailyData[date] = { income: 0, expenses: 0 }
    }

    if (op.type === 'income') {
      dailyData[date].income += op.amount
    } else {
      dailyData[date].expenses += op.amount
    }
  })
  const expensesByCategory =
    apiData.value.category_expenses?.map((item) => ({
      name: item.tag_title,
      value: item.expenses_sum,
    })) || []
  const incomeByCategory =
    apiData.value.category_income?.map((item) => ({
      name: item.tag_title,
      value: item.income_sum,
    })) || []

  return {
    daily: Object.entries(dailyData).map(([date, values]) => ({
      date,
      income: values.income,
      expenses: values.expenses,
    })),
    categories: {
      expenses: expensesByCategory,
      income: incomeByCategory,
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

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU')
}

const updateCharts = () => {
  if (incomeExpenseChart) {
    incomeExpenseChart.destroy()
  }
  if (expensesByCategoryChart) {
    expensesByCategoryChart.destroy()
  }
  const incomeExpenseCtx = document.getElementById('incomeExpenseChart')
  if (incomeExpenseCtx) {
    incomeExpenseChart = new Chart(incomeExpenseCtx, {
      type: 'line',
      data: {
        labels: chartData.value.daily.map((item) => formatDate(item.date)),
        datasets: [
          {
            label: 'Доходы',
            data: chartData.value.daily.map((item) => item.income),
            borderColor: colors.income,
            backgroundColor: colors.income + '20',
            tension: 0.1,
            fill: true,
          },
          {
            label: 'Расходы',
            data: chartData.value.daily.map((item) => item.expenses),
            borderColor: colors.expenses,
            backgroundColor: colors.expenses + '20',
            tension: 0.1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#f3f4f6',
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.dataset.label + ': ' + formatCurrency(context.raw) + ' ₽'
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#9ca3af',
            },
            grid: {
              color: '#374151',
            },
          },
          y: {
            ticks: {
              color: '#9ca3af',
              callback: function (value) {
                return formatCurrency(value) + ' ₽'
              },
            },
            grid: {
              color: '#374151',
            },
          },
        },
      },
    })
  }
  const expensesByCategoryCtx = document.getElementById('expensesByCategoryChart')
  if (expensesByCategoryCtx && chartData.value.categories.expenses.length > 0) {
    expensesByCategoryChart = new Chart(expensesByCategoryCtx, {
      type: 'doughnut',
      data: {
        labels: chartData.value.categories.expenses.map((item) => item.name),
        datasets: [
          {
            data: chartData.value.categories.expenses.map((item) => item.value),
            backgroundColor: colors.categories,
            borderColor: '#1f2937',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#f3f4f6',
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${context.label}: ${formatCurrency(value)} ₽ (${percentage}%)`
              },
            },
          },
        },
      },
    })
  }
}

onMounted(() => {
  const { start, end } = getDateRange(selectedPeriod.value)
  customStartDate.value = start
  customEndDate.value = end

  loadData()
})

watch(selectedPeriod, handlePeriodChange)
</script>

<template>
  <div class="stats-page">
    <AppHeader />

    <main class="stats-container">
      <h1 class="stats-title">Финансовая статистика</h1>

      <div class="period-selector">
        <label>Период:</label>
        <select v-model="selectedPeriod" :disabled="isLoading">
          <option v-for="period in periods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>

        <div v-if="showCustomDatePicker" class="custom-date-picker">
          <div class="date-input-group">
            <label for="startDate">С:</label>
            <input
              id="startDate"
              v-model="customStartDate"
              type="date"
              class="date-input"
              :max="customEndDate"
            />
          </div>
          <div class="date-input-group">
            <label for="endDate">По:</label>
            <input
              id="endDate"
              v-model="customEndDate"
              type="date"
              class="date-input"
              :min="customStartDate"
            />
          </div>
          <button
            class="apply-dates-button"
            @click="applyCustomDates"
            :disabled="!customStartDate || !customEndDate || isLoading"
          >
            Применить
          </button>
        </div>

        <span v-if="isLoading" class="loading-text">Загрузка...</span>
      </div>

      <div class="period-info" v-if="apiData">
        <span
          >Показаны данные за период: {{ formatDate(getDateRange(selectedPeriod).start) }} —
          {{ formatDate(getDateRange(selectedPeriod).end) }}</span
        >
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
          <div class="chart-wrapper">
            <canvas id="incomeExpenseChart"></canvas>
          </div>
        </div>

        <div class="chart-container">
          <h3>Структура расходов</h3>
          <div class="chart-wrapper">
            <canvas id="expensesByCategoryChart"></canvas>
          </div>
          <p v-if="chartData.categories.expenses.length === 0" class="no-data">
            Нет данных о расходах за выбранный период
          </p>
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
              <tr v-for="(cat, index) in chartData.categories.income" :key="'income-' + index">
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
              <tr v-for="(cat, index) in chartData.categories.expenses" :key="'expense-' + index">
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
  padding: clamp(1rem, 2vw, 2rem);
  padding-top: clamp(4rem, 8vw, 6rem);
}

.stats-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: #60a5fa;
  margin-bottom: clamp(1rem, 2vw, 2rem);
  text-align: center;
}

.period-selector {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  position: relative;
}

.period-selector label {
  font-weight: 500;
  font-size: clamp(0.9rem, 1.1vw, 1rem);
}

.period-selector select {
  padding: 0.5rem 1rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  color: #f3f4f6;
  font-size: clamp(0.9rem, 1.1vw, 1rem);
  min-width: 180px;
}

.custom-date-picker {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
  margin-top: 0.75rem;
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100%;
  border: 1px solid #374151;
  box-sizing: border-box;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.date-input-group label {
  font-size: 0.85rem;
  color: #9ca3af;
  font-weight: 500;
  white-space: nowrap;
}

.date-input-wrapper {
  position: relative;
  width: 100%;
}

.date-input-wrapper::after {
  content: '📅';
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.date-input {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  color: #f3f4f6;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
  appearance: none;
  -webkit-appearance: none;
}

.date-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.apply-dates-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition:
    background-color 0.2s,
    transform 0.1s;
  height: fit-content;
  flex-shrink: 0;
  min-width: 100px;
  white-space: nowrap;
}

.apply-dates-button:hover {
  background-color: #2563eb;
}

.apply-dates-button:active {
  transform: scale(0.98);
}

.apply-dates-button:disabled {
  background-color: #4b5563;
  cursor: not-allowed;
  opacity: 0.7;
}

.period-info {
  margin-bottom: 1rem;
  color: #9ca3af;
  font-size: 0.9rem;
}

.loading-text {
  color: #9ca3af;
  font-size: clamp(0.85rem, 1vw, 0.9rem);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: clamp(1rem, 1.5vw, 1.5rem);
  margin-bottom: clamp(2rem, 3vw, 3rem);
}

.summary-card {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: clamp(1rem, 1.5vw, 1.5rem);
  text-align: center;
}

.summary-card h3 {
  margin-top: 0;
  color: #9ca3af;
  font-size: clamp(1rem, 1.2vw, 1.1rem);
}

.summary-card .amount {
  font-size: clamp(1.4rem, 2vw, 1.75rem);
  font-weight: 600;
  margin: clamp(0.75rem, 1vw, 1rem) 0;
}

.summary-card .subtext {
  color: #9ca3af;
  font-size: clamp(0.8rem, 1vw, 0.9rem);
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
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  gap: clamp(1rem, 1.5vw, 1.5rem);
  margin-bottom: clamp(2rem, 3vw, 3rem);
}

.chart-container {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: clamp(1rem, 1.5vw, 1.5rem);
}

.chart-container h3 {
  margin-top: 0;
  color: #60a5fa;
  font-size: clamp(1.1rem, 1.4vw, 1.25rem);
}

.chart-wrapper {
  height: clamp(250px, 40vw, 400px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.categories-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  gap: clamp(1rem, 1.5vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 2vw, 2rem);
}

.categories-table {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: clamp(1rem, 1.5vw, 1.5rem);
}

.categories-table h3 {
  margin-top: 0;
  color: #60a5fa;
  font-size: clamp(1.1rem, 1.4vw, 1.25rem);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: clamp(0.75rem, 1vw, 1rem);
  font-size: clamp(0.85rem, 1vw, 0.9rem);
}

th,
td {
  padding: clamp(0.5rem, 0.75vw, 0.75rem);
  text-align: left;
  border-bottom: 1px solid #374151;
}

th {
  color: #9ca3af;
  font-weight: 500;
}

.category-color {
  display: inline-block;
  width: clamp(10px, 1.2vw, 12px);
  height: clamp(10px, 1.2vw, 12px);
  border-radius: 50%;
  margin-right: 0.5rem;
}

.no-data {
  color: #9ca3af;
  text-align: center;
  padding: clamp(1rem, 2vw, 2rem) 0;
  font-size: clamp(0.9rem, 1.1vw, 1rem);
}
@media (max-width: 768px) {
  .custom-date-picker {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .date-input-group {
    width: 100%;
  }

  .apply-dates-button {
    width: 100%;
    padding: 0.65rem;
    margin-top: 0.25rem;
  }
}
@media (max-width: 640px) {
  .custom-date-picker {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0.75rem;
  }

  .date-input-group {
    width: 100%;
  }

  .date-input {
    padding: 0.6rem 0.75rem;
  }

  .apply-dates-button {
    width: 100%;
    padding: 0.6rem;
    margin-top: 0.25rem;
  }
}

@media (max-width: 480px) {
  .period-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .custom-date-picker {
    flex-direction: column;
    align-items: flex-start;
  }

  .apply-dates-button {
    margin-left: 0;
    width: 100%;
  }

  .summary-card .amount {
    font-size: 1.5rem;
  }

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .chart-container {
    padding: 1rem 0.75rem;
  }
  .date-input-group label {
    font-size: 0.8rem;
  }

  .date-input {
    font-size: 0.85rem;
    padding: 0.5rem 0.6rem;
  }

  .apply-dates-button {
    font-size: 0.85rem;
  }
}

@media print {
  .stats-page {
    background-color: white !important;
    color: black !important;
    padding: 0;
  }

  .stats-container {
    padding: 1rem;
    padding-top: 2rem;
  }

  .summary-card,
  .chart-container,
  .categories-table {
    background-color: white !important;
    border: 1px solid #ddd;
    color: black !important;
  }

  .income .amount,
  .balance .amount:not(.negative) {
    color: darkgreen !important;
  }

  .expense .amount,
  .balance.negative .amount {
    color: darkred !important;
  }

  .chart-container h3,
  .categories-table h3 {
    color: #1a365d !important;
  }

  th,
  td {
    border-color: #ddd !important;
    color: black !important;
  }
}
@media (max-width: 400px) {
  .date-input {
    padding: 0.6rem 2rem 0.6rem 0.75rem;
    font-size: 0.85rem;
  }

  .date-input-group label {
    font-size: 0.8rem;
  }

  .apply-dates-button {
    font-size: 0.85rem;
  }
}
</style>
