import { $authHost, $host } from './index'
import { jwtDecode } from 'jwt-decode'

export const FetchTag = async () => {
  try {
    const { data } = await $authHost.get('tags/')
    return data
  } catch (error) {
    console.error('Ошибка при проверке пользователя:', error)
  }
}

export const CreateTag = async (title) => {
  try {
    const { data } = await $authHost.post('tags/', { title })
    return data
  } catch (error) {
    throw error
  }
}
export const DeleteTag = async (id) => {
  try {
    const { data } = await $authHost.delete(`tags/${id}`)
    return data
  } catch (error) {
    throw error
  }
}
