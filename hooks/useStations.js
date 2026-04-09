// কাস্টম হুক - পাম্পের তথ্য লোড করার জন্য (প্রতি ৬০ সেকেন্ডে স্বয়ংক্রিয় রিফ্রেশ)
import { useState, useEffect, useCallback } from 'react'
import { fetchStations } from '../api'

export function useStations() {
  const [stations, setStations]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  // পাম্পের তথ্য লোড করার ফাংশন
  const loadStations = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchStations()
      setStations(data)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('পাম্প লোড ত্রুটি:', err)
      setError(
        err.response?.data?.message ||
        'তথ্য লোড করতে সমস্যা হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // প্রথমবার লোড
  useEffect(() => {
    loadStations()
  }, [loadStations])

  // প্রতি ৬০ সেকেন্ডে স্বয়ংক্রিয় রিফ্রেশ
  useEffect(() => {
    const interval = setInterval(() => {
      loadStations()
    }, 60_000)
    return () => clearInterval(interval) // কম্পোনেন্ট আনমাউন্টে পরিষ্কার করা
  }, [loadStations])

  return { stations, loading, error, refresh: loadStations, lastRefresh }
}
