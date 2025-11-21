import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'https://food-panda-zeta.vercel.app/api'

export const api = axios.create({
  baseURL,
  withCredentials: true
})





