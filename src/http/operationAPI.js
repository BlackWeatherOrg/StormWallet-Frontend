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
    const { data } = await $authHost.post('operations/', { tag_id, type, amount, Date })
    console.log(data)
    return data
  } catch (error) {
    throw error
  }
}
export const DeleteOperation = async (id) => {
  try {
    const { data } = await $authHost.delete('operations/', { params: { id: id } })
    return data
  } catch (error) {
    throw error
  }
}
export const UpdateOperation = async (id, operationData) => {
  try {
    const { data } = await $authHost.put(`operations/${id}`, operationData)
    return data
  } catch (error) {
    throw error
  }
}