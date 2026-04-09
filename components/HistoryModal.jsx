// ইতিহাস মডাল - একটি পাম্পের আগের আপডেটগুলো দেখায়
import { useState, useEffect } from 'react'
import { fetchStationHistory } from '../api'
import { formatDateTime, getCrowdInfo, FUEL_TYPES } from '../utils'

export default function HistoryModal({ station, onClose }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // মডাল খোলার সাথে সাথে ইতিহাস লোড করা
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchStationHistory(station._id)
        setHistory(data)
      } catch {
        setHistory([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [station._id])

  // ESC চাপলে মডাল বন্ধ হবে
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    // ব্যাকড্রপ
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* মডাল হেডার */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{station.name}</h3>
            <p className="text-gray-500 text-sm">আপডেটের ইতিহাস</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none
                       w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* মডাল বডি */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {loading ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-3xl mb-2 animate-spin">⏳</div>
              <p>লোড হচ্ছে...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-3xl mb-2">📭</div>
              <p>কোনো ইতিহাস নেই</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => {
                const crowd = getCrowdInfo(item.crowd)
                return (
                  <div
                    key={item._id}
                    className={`p-4 rounded-xl border ${
                      idx === 0
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    {/* সময় ও রিপোর্টার */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        🕐 {formatDateTime(item.createdAt)}
                      </span>
                      {idx === 0 && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">
                          সর্বশেষ
                        </span>
                      )}
                    </div>

                    {/* জ্বালানির তথ্য */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {FUEL_TYPES.map((fuel) => (
                        <span
                          key={fuel.key}
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            item[fuel.key]
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {fuel.icon} {fuel.label}: {item[fuel.key] ? 'আছে' : 'নেই'}
                        </span>
                      ))}
                    </div>

                    {/* ভিড় ও রিপোর্টার */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${crowd.bg} ${crowd.text}`}>
                        {crowd.emoji} {crowd.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        👤 {item.reporterName || 'অজানা'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* মডাল ফুটার */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700
                       font-medium py-2.5 rounded-xl transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  )
}
