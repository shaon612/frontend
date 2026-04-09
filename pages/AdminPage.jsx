// অ্যাডমিন পেজ - পাম্প যোগ করা, সম্পাদনা করা ও পরিচালনা
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fetchStations, updateStation } from '../../src/api'
import StationFormModal from '../components/StationFormModal'
import { timeAgo, toBengaliNumber } from '../../src/utils'

export default function AdminPage() {
  const [stations,    setStations]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [showModal,   setShowModal]   = useState(false)
  const [editStation, setEditStation] = useState(null) // null = নতুন, object = সম্পাদনা

  // স্টেশন লোড করা
  const loadStations = async () => {
    try {
      setLoading(true)
      const data = await fetchStations()
      // সব স্টেশন দেখানো হবে (inactive সহ) — তাই আলাদাভাবে আনছি না
      setStations(data)
    } catch {
      toast.error('তথ্য লোড করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStations() }, [])

  // পাম্প সক্রিয়/নিষ্ক্রিয় টগল করা
  const toggleActive = async (station) => {
    try {
      await updateStation(station._id, { ...station, isActive: !station.isActive })
      toast.success(
        station.isActive ? 'পাম্প নিষ্ক্রিয় করা হয়েছে' : 'পাম্প সক্রিয় করা হয়েছে'
      )
      loadStations()
    } catch {
      toast.error('পরিবর্তন করতে সমস্যা হয়েছে')
    }
  }

  // সম্পাদনা মডাল খোলা
  const openEdit = (station) => {
    setEditStation(station)
    setShowModal(true)
  }

  // নতুন পাম্প মডাল খোলা
  const openAdd = () => {
    setEditStation(null)
    setShowModal(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* ── পেজ হেডার ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">⚙️ পাম্প পরিচালনা</h1>
          <p className="text-gray-500 text-sm">
            পাম্প যোগ করুন, তথ্য পরিবর্তন করুন
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-green-700 hover:bg-green-800 text-white font-bold
                     px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2
                     shadow-md"
        >
          <span className="text-lg">➕</span>
          <span>নতুন পাম্প</span>
        </button>
      </div>

      {/* ── পরিসংখ্যান ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <MiniStat
          icon="🏪" color="blue"
          value={toBengaliNumber(stations.length)}
          label="মোট পাম্প"
        />
        <MiniStat
          icon="✅" color="green"
          value={toBengaliNumber(stations.filter(s => s.isActive).length)}
          label="সক্রিয়"
        />
        <MiniStat
          icon="⛽" color="yellow"
          value={toBengaliNumber(stations.filter(s => s.latestUpdate?.petrol || s.latestUpdate?.diesel || s.latestUpdate?.octane).length)}
          label="জ্বালানি আছে"
        />
        <MiniStat
          icon="🕐" color="gray"
          value={toBengaliNumber(stations.filter(s => s.latestUpdate?.createdAt).length)}
          label="আপডেট আছে"
        />
      </div>

      {/* ── স্টেশন তালিকা ───────────────────────────────────────────────── */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3 animate-spin">⏳</div>
          <p>লোড হচ্ছে...</p>
        </div>
      ) : stations.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🏪</div>
          <p className="font-medium">কোনো পাম্প নেই</p>
          <p className="text-sm mt-1">নতুন পাম্প যোগ করুন</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stations.map((station) => (
            <div
              key={station._id}
              className={`bg-white rounded-2xl border-2 p-5 transition-all
                ${station.isActive ? 'border-gray-100 shadow-sm' : 'border-gray-200 opacity-60'}`}
            >
              <div className="flex items-start gap-4">
                {/* স্ট্যাটাস আইকন */}
                <div className="text-3xl flex-shrink-0 mt-0.5">
                  {station.isActive ? '🟢' : '🔴'}
                </div>

                {/* তথ্য */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-bold text-gray-800 text-base">{station.name}</h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                        <span>📍</span> {station.location}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                      station.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {station.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>

                  {/* সর্বশেষ আপডেট সারাংশ */}
                  {station.latestUpdate?.createdAt && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {['petrol','diesel','octane'].map(f => (
                        <span key={f} className={`text-xs px-2 py-0.5 rounded-full ${
                          station.latestUpdate[f]
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {f === 'petrol' ? 'পেট্রোল' : f === 'diesel' ? 'ডিজেল' : 'অকটেন'}:{' '}
                          {station.latestUpdate[f] ? '✓' : '✗'}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        🕐 {timeAgo(station.latestUpdate.createdAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* অ্যাকশন বোতামগুলো */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {/* সম্পাদনা বোতাম */}
                  <button
                    onClick={() => openEdit(station)}
                    className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-700
                               font-medium px-3 py-1.5 rounded-lg transition-colors
                               flex items-center gap-1"
                  >
                    ✏️ সম্পাদনা
                  </button>

                  {/* সক্রিয়/নিষ্ক্রিয় টগল */}
                  <button
                    onClick={() => toggleActive(station)}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors
                                flex items-center gap-1 ${
                      station.isActive
                        ? 'bg-red-50 hover:bg-red-100 text-red-600'
                        : 'bg-green-50 hover:bg-green-100 text-green-700'
                    }`}
                  >
                    {station.isActive ? '⏹ বন্ধ করুন' : '▶ চালু করুন'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── স্টেশন ফর্ম মডাল ────────────────────────────────────────────── */}
      {showModal && (
        <StationFormModal
          station={editStation}
          onClose={() => { setShowModal(false); setEditStation(null) }}
          onSuccess={loadStations}
        />
      )}
    </div>
  )
}

// ── সাব-কম্পোনেন্ট: মিনি স্ট্যাট বক্স ──────────────────────────────────────
function MiniStat({ icon, value, label, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700',
    green:  'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    gray:   'bg-gray-50 text-gray-600',
  }
  return (
    <div className={`rounded-xl p-3 text-center ${colors[color]}`}>
      <div className="text-xl mb-0.5">{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  )
}
