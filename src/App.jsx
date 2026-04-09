// মূল অ্যাপ কম্পোনেন্ট - পেজ রাউটিং পরিচালনা করে
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Header from '../components/Header'
import HomePage from '../pages/HomePage'
import UpdatePage from '../pages/UpdatePage'
import AdminPage from '../pages/AdminPage'

import { useStations } from '../hooks/useStations'


export default function App() {
  // হেডারে রিফ্রেশ বোতামের জন্য stations হুক এখানেও
  const { refresh, lastRefresh, loading } = useStations()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* সাইটের হেডার */}
      <Header
        onRefresh={refresh}
        lastRefresh={lastRefresh}
        loading={loading}
      />

      {/* মূল কন্টেন্ট */}
      <main className="pb-12">
        <Routes>
          <Route path="/"       element={<HomePage />}   />
          <Route path="/update" element={<UpdatePage />}  />
          <Route path="/admin"  element={<AdminPage />}   />
          {/* ৪০৪ পেজ */}
          <Route path="*" element={
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-xl font-bold mb-2">পেজটি পাওয়া যায়নি</h2>
              <a href="/" className="text-green-700 underline">হোম পেজে যান</a>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}
