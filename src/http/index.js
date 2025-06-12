import axios from 'axios'

const $host = axios.create({
  baseURL: 'http://89.169.165.136:7500/api/v1/',
})

const $authHost = axios.create({
  baseURL: 'http://89.169.165.136:7500/api/v1/',
})

const authInterceptor = (config) => {
  console.log(localStorage.getItem('token'))
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}

$authHost.interceptors.request.use(authInterceptor)

export { $host, $authHost }
