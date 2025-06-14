<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '../components/Appheader.vue'
import { FetchTag, CreateTag, DeleteTag } from '@/http/tagsAPI'
import {
  FetchOperation,
  CreateOperation,
  DeleteOperation,
  UpdateOperation,
} from '@/http/operationAPI'
const selectedDate = ref(new Date().toISOString().split('T')[0] + 'T00:00:00Z')
const operations = ref([])
const newOperation = ref({
  type: 'expense',
  amount: '',
  category: '',
  description: '',
})
const tags = ref([])
const editingId = ref(null)
const showForm = ref(false)
const isLoading = ref(false)
const newTagName = ref('')
const showAddTag = ref(false)
const errorMessage = ref('')
const deletingTagId = ref(null)

const loadData = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    const tagsResponse = await FetchTag()
    tags.value = tagsResponse
    const operationsResponse = await FetchOperation()
    operations.value = operationsResponse.map((op) => ({
      id: op.ID,
      date: op.date.split('T')[0],
      type: op.type,
      amount: op.amount,
      category: op.tag?.title || 'Неизвестно',
    }))
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
    errorMessage.value = 'Не удалось загрузить данные'
  } finally {
    isLoading.value = false
  }
}

const createNewTag = async () => {
  if (!newTagName.value.trim()) return
  try {
    isLoading.value = true
    await CreateTag(newTagName.value.trim())
    await loadData()
    newOperation.value.category = newTagName.value.trim()
    newTagName.value = ''
    showAddTag.value = false
  } catch (error) {
    console.error('Ошибка создания тега:', error)
    errorMessage.value = 'Ошибка создания категории'
  } finally {
    isLoading.value = false
  }
}

const deleteSelectedTag = async () => {
  if (!newOperation.value.category) return
  const tag = tags.value.find(
    (t) => t.title.trim().toLowerCase() === newOperation.value.category.trim().toLowerCase(),
  )
  if (!tag) throw new Error('Категория не найдена')

  try {
    if (!confirm(`Вы уверены, что хотите удалить категорию "${tag.title}"?`)) return

    isLoading.value = true
    deletingTagId.value = tag.ID
    await DeleteTag(tag.ID)
    await loadData()
    newOperation.value.category = ''
  } catch (error) {
    console.error('Ошибка удаления тега:', error)
    errorMessage.value = 'Ошибка удаления категории'
  } finally {
    isLoading.value = false
    deletingTagId.value = null
  }
}

const saveOperation = async () => {
  if (!newOperation.value.amount || !newOperation.value.category) return

  try {
    isLoading.value = true
    errorMessage.value = ''
    const tag = tags.value.find(
      (t) => t.title.trim().toLowerCase() === newOperation.value.category.trim().toLowerCase(),
    )
    if (!tag) throw new Error('Категория не найдена')

    const operationData = {
      tag_id: tag.ID,
      type: newOperation.value.type,
      amount: parseFloat(newOperation.value.amount),
      Date: selectedDate.value,
    }

    if (editingId.value) {
      await UpdateOperation(
        editingId.value,
        tag.ID,
        newOperation.value.type,
        parseFloat(newOperation.value.amount),
        selectedDate.value,
      )
    } else {
      await CreateOperation(
        tag.ID,
        newOperation.value.type,
        parseFloat(newOperation.value.amount),
        selectedDate.value,
      )
    }

    await loadData()
    resetForm()
  } catch (error) {
    console.error('Ошибка сохранения операции:', error)
    errorMessage.value = 'Ошибка сохранения операции'
  } finally {
    isLoading.value = false
  }
}

const deleteOperation = async (id) => {
  try {
    if (!confirm('Вы уверены, что хотите удалить эту операцию?')) return

    isLoading.value = true
    await DeleteOperation(id)
    await loadData()
  } catch (error) {
    console.error('Ошибка удаления операции:', error)
    errorMessage.value = 'Ошибка удаления операции'
  } finally {
    isLoading.value = false
  }
}

const filteredOperations = computed(() => {
  return operations.value.filter((op) => op.date === selectedDate.value.split('T')[0])
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

const editOperation = (operation) => {
  newOperation.value = { ...operation }
  editingId.value = operation.id
  showForm.value = true
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
  showAddTag.value = false
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="dashboard-page">
    <AppHeader />

    <main class="dashboard-container">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <div class="date-selector">
        <input
          type="date"
          :value="selectedDate.split('T')[0]"
          @input="selectedDate = `${$event.target.value}T00:00:00Z`"
          class="date-input"
          :disabled="isLoading"
        />
        <button @click="showForm = true" class="add-button" :disabled="isLoading">
          + Добавить операцию
        </button>
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

      <div v-if="showForm" class="operation-formm">
        <h2>{{ editingId ? 'Редактировать операцию' : 'Добавить операцию' }}</h2>

        <div class="formm-group">
          <label>Тип операции</label>
          <div class="type-selector">
            <button
              @click="newOperation.type = 'income'"
              :class="{ active: newOperation.type === 'income' }"
              :disabled="isLoading"
            >
              Доход
            </button>
            <button
              @click="newOperation.type = 'expense'"
              :class="{ active: newOperation.type === 'expense' }"
              :disabled="isLoading"
            >
              Расход
            </button>
          </div>
        </div>

        <div class="formm-group">
          <label>Сумма (₽)</label>
          <input
            type="number"
            v-model="newOperation.amount"
            placeholder="Введите сумму"
            :disabled="isLoading"
          />
        </div>

        <div class="formm-group">
          <label>Категория</label>
          <div class="tag-selector">
            <div class="select-with-button">
              <select v-model="newOperation.category" :disabled="isLoading">
                <option value="" disabled>Выберите категорию</option>
                <option v-for="tag in tags" :key="tag.id" :value="tag.title">
                  {{ tag.title }}
                </option>
                <option value="__add_new__">+ Добавить новую категорию</option>
              </select>
              <button
                v-if="newOperation.category && newOperation.category !== '__add_new__'"
                @click="deleteSelectedTag"
                class="delete-tag-btn"
                :disabled="isLoading || deletingTagId"
              >
                🗑️
              </button>
            </div>

            <div v-if="newOperation.category === '__add_new__'" class="add-tag-formm">
              <input
                type="text"
                v-model="newTagName"
                placeholder="Название новой категории"
                @keyup.enter="createNewTag"
                :disabled="isLoading"
              />
              <button @click="createNewTag" class="small-button" :disabled="isLoading">
                Добавить
              </button>
              <button
                @click="newOperation.category = ''"
                class="small-button cancel"
                :disabled="isLoading"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>

        <div class="formm-actions">
          <button @click="resetForm" class="cancel-button" :disabled="isLoading">Отмена</button>
          <button
            @click="saveOperation"
            class="save-button"
            :disabled="!newOperation.category || isLoading"
          >
            {{ isLoading ? 'Загрузка...' : editingId ? 'Обновить' : 'Сохранить' }}
          </button>
        </div>
      </div>

      <div class="operations-list">
        <h2>Операции за {{ new Date(selectedDate).toLocaleDateString('ru-RU') }}</h2>

        <div v-if="isLoading" class="loading-state">Загрузка операций...</div>

        <div v-else-if="filteredOperations.length === 0" class="empty-state">
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
              <button @click="editOperation(operation)" class="edit-button" :disabled="isLoading">
                ✏️
              </button>
              <button
                @click="deleteOperation(operation.id)"
                class="delete-button"
                :disabled="isLoading"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
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

.error-message {
  color: #ef4444;
  background-color: #1f2937;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.date-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.date-input {
  padding: 0.75rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  color: #f3f4f6;
  font-size: 1rem;
  flex: 1;
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

.add-button:disabled {
  background-color: #374151;
  cursor: not-allowed;
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

.operation-formm {
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.operation-formm h2 {
  margin-top: 0;
  color: #60a5fa;
}

.formm-group {
  margin-bottom: 1.5rem;
}

.formm-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #d1d5db;
  font-weight: 500;
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
  box-sizing: border-box;
}
.formm-group input[type='number'] {
  -moz-appearance: textfield;
}
.formm-group input[type='number']::-webkit-outer-spin-button,
.formm-group input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.formm-group.amount-input {
  position: relative;
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
  transition: background-color 0.2s;
}

.type-selector button.active {
  background-color: #3b82f6;
}

.type-selector button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.tag-selector {
  position: relative;
}

.select-with-button {
  display: flex;
  gap: 0.5rem;
}

.delete-tag-btn {
  background-color: #ef4444;
  border: none;
  border-radius: 0.375rem;
  color: white;
  padding: 0 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-tag-btn:hover {
  background-color: #dc2626;
}

.delete-tag-btn:disabled {
  background-color: #7f1d1d;
  cursor: not-allowed;
}

.add-tag-formm {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.add-tag-formm input {
  flex-grow: 1;
  padding: 0.75rem;
  background-color: #374151;
  border: 1px solid #4b5563;
  border-radius: 0.375rem;
  color: #f3f4f6;
}

.small-button {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}

.small-button:not(.cancel) {
  background-color: #3b82f6;
  color: white;
}

.small-button:not(.cancel):hover {
  background-color: #2563eb;
}

.small-button.cancel {
  background-color: #374151;
  color: #f3f4f6;
}

.small-button.cancel:hover {
  background-color: #4b5563;
}

.small-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.formm-actions {
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
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  border: none;
  border-radius: 0.375rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-button:hover {
  background-color: #059669;
}

.save-button:disabled {
  background-color: #374151;
  cursor: not-allowed;
}

.operations-list h2 {
  color: #60a5fa;
  margin-bottom: 1rem;
}

.loading-state,
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

.operation-item.income .operation-amount {
  color: #10b981;
}

.operation-item.expense .operation-amount {
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
  transition: opacity 0.2s;
}

.edit-button:hover {
  color: #3b82f6;
}

.delete-button:hover {
  color: #ef4444;
}

.edit-button:disabled,
.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  }

  .select-with-button {
    flex-direction: column;
  }

  .delete-tag-btn {
    padding: 0.75rem;
    width: 100%;
  }
  .formm-group input {
    width: 96%;
  }

  .add-tag-formm {
    flex-direction: column;
  }
  .dashboard-container {
    padding: 1rem;
    padding-top: 5rem;
  }
  .formm-group input,
  .formm-group select {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
  .formm-group input {
    width: 99%;
  }
  .operation-formm {
    padding: 1.2rem;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
  }
}
@media (max-width: 480px) {
  .formm-group input,
  .formm-group select {
    padding: 0.65rem;
    font-size: 0.9rem;
  }

  .operation-formm {
    padding: 1rem;
    gap: 1rem;
  }
}
</style>
