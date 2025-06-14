import { $authHost, $host } from './index'
import { jwtDecode } from 'jwt-decode'

export const login = async (email, password) => {
  const { data } = await $host.post('users/login', { email, password })
  localStorage.setItem('token', data.token)
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Токен не найден в локальном хранилище')
  }
  return jwtDecode(data.token)
}

export const check = async () => {
  try {
    const { data } = await $authHost.get('users/me')
    localStorage.setItem('id', data.id)
    return data
  } catch (error) {
    console.error('Ошибка при проверке пользователя:', error)
  }
}

export const FetchUser = async (id) => {
  try {
    const { data } = await $authHost.get(`users/${id}`)
    return data
  } catch (error) {
    console.error('Ошибка при проверке пользователя:', error)
    throw error
  }
}
export const registration = async (email, password) => {
  try {
    const { data } = await $host.post('users/', { email, password })
    localStorage.setItem('message', data.message)
    return data.message
  } catch (error) {
    throw error
  }
}
