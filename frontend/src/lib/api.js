import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://food-panda-zeta.vercel.app/api',
  withCredentials: true
})




