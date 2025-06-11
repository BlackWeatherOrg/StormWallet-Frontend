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
    console.log(data)
    return data
  } catch (error) {
    throw error
  }
}
