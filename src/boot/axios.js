import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const apiUrl = `${process.env.API_URL}:${process.env.API_PORT}`
const posApiUrl = `${process.env.API_URL}:${process.env.POS_PORT}`

// this is a axios instance for the app
const api = axios.create({ baseURL: apiUrl })
const posApi = axios.create({ baseURL: posApiUrl })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api, posApi }
