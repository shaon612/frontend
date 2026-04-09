// API হেলপার - ব্যাকএন্ডের সাথে যোগাযোগের জন্য
import axios from 'axios'

// বেস URL (vite proxy দিয়ে /api → localhost:5000/api)
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// ── স্টেশন API ────────────────────────────────────────────────────────────────

// সব পাম্পের তালিকা + সর্বশেষ আপডেট আনা
export const fetchStations = async () => {
  const { data } = await api.get('/stations')
  return data.data
}

// একটি পাম্পের আপডেট ইতিহাস আনা
export const fetchStationHistory = async (stationId) => {
  const { data } = await api.get(`/stations/${stationId}/history`)
  return data.data
}

// নতুন পাম্প যোগ করা (অ্যাডমিনের জন্য)
export const addStation = async (stationData) => {
  const { data } = await api.post('/stations', stationData)
  return data
}

// পাম্পের তথ্য সম্পাদনা করা
export const updateStation = async (id, stationData) => {
  const { data } = await api.put(`/stations/${id}`, stationData)
  return data
}

// ── আপডেট API ─────────────────────────────────────────────────────────────────

// নতুন জ্বালানি আপডেট জমা দেওয়া
export const submitUpdate = async (updateData) => {
  const { data } = await api.post('/update', updateData)
  return data
}

// সর্বশেষ আপডেটগুলো আনা
export const fetchRecentUpdates = async () => {
  const { data } = await api.get('/update/recent')
  return data.data
}

export default api
