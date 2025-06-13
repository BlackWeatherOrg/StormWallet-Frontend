import { $authHost, $host } from './index'
import { jwtDecode } from 'jwt-decode'

export const FetchOperation = async () => {
  try {
    const { data } = await $authHost.get('operations/')
    return data
  } catch (error) {
    console.error('Ошибка при проверке пользователя:', error)
  }
}

export const CreateOperation = async (tag_id, type, amount, Date) => {
  try {
    const { data } = await $authHost.post('operations/', {
      tag_id,
      type,
      amount,
      Date,
    })
    return data
  } catch (error) {
    console.error('Error in CreateOperation:', error)
    throw error
  }
}
export const DeleteOperation = async (id) => {
  try {
    const { data } = await $authHost.delete(`operations/${id}`)
    return data
  } catch (error) {
    throw error
  }
}
export const UpdateOperation = async (id, tag_id, type, amount, Date) => {
  try {
    const { data } = await $authHost.put(`operations/${id}`, {
      tag_id,
      type,
      amount,
      Date,
    })
    return data
  } catch (error) {
    throw error
  }
}
