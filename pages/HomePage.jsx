// হোম পেজ - সব পাম্পের তালিকা ও ফিল্টার
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStations } from '../hooks/useStations'
import StationCard from '../components/StationCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import { toBengaliNumber } from '../utils'

export default function HomePage() {
  const { stations, loading, error, refresh } = useStations()

  // ফিল্টার ও সার্চ অবস্থা
  const [search,         setSearch]         = useState('')
  const [filterFuel,     setFilterFuel]     = useState('all')   // all | petrol | diesel | octane
  const [filterCrowd,    setFilterCrowd]    = useState('all')   // all | none | medium | heavy
  const [filterAvail,    setFilterAvail]    = useState('all')   // all | available | unavailable

  // ফিল্টার করা স্টেশনের তালিকা
  const filtered = useMemo(() => {
    return stations.filter((s) => {
      const u = s.latestUpdate

      // সার্চ ফিল্টার
      if (search) {
        const q = search.toLowerCase()
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.location.toLowerCase().includes(q)
        ) return false
      }

      // জ্বালানি ফিল্টার
      if (filterFuel !== 'all' && !u?.[filterFuel]) return false

      // ভিড় ফিল্টার
      if (filterCrowd !== 'all' && u?.crowd !== filterCrowd) return false

      // প্রাপ্যতা ফিল্টার
      if (filterAvail === 'available') {
        if (!u?.petrol && !u?.diesel && !u?.octane) return false
      } else if (filterAvail === 'unavailable') {
        if (u?.petrol || u?.diesel || u?.octane) return false
      }

      return true
    })
  }, [stations, search, filterFuel, filterCrowd, filterAvail])

  // সারাংশ পরিসংখ্যান
  const stats = useMemo(() => ({
    total:     stations.length,
    available: stations.filter(s => s.latestUpdate?.petrol || s.latestUpdate?.diesel || s.latestUpdate?.octane).length,
    noCrowd:   stations.filter(s => s.latestUpdate?.crowd === 'none').length,
  }), [stations])

  if (loading) return <LoadingSpinner message="পাম্পের তথ্য লোড হচ্ছে..." />
  if (error)   return <ErrorMessage message={error} onRetry={refresh} />

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

      {/* ── সারাংশ পরিসংখ্যান ── */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox icon="⛽" value={toBengaliNumber(stats.total)}     label="মোট পাম্প"          color="blue"   />
        <StatBox icon="✅" value={toBengaliNumber(stats.available)} label="জ্বালানি আছে"        color="green"  />
        <StatBox icon="😊" value={toBengaliNumber(stats.noCrowd)}   label="ভিড় নেই"            color="yellow" />
      </div>

      {/* ── সার্চ বার ── */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="পাম্পের নাম বা এলাকা খুঁজুন..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl
                     focus:border-green-500 focus:outline-none text-gray-800
                     placeholder-gray-300 bg-white shadow-sm transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      {/* ── ফিল্টার প্যানেল ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
          🎛️ ফিল্টার করুন
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* জ্বালানি ফিল্টার */}
          <FilterSelect
            label="জ্বালানির ধরন"
            value={filterFuel}
            onChange={setFilterFuel}
            options={[
              { value: 'all',    label: '⛽ সব ধরন' },
              { value: 'petrol', label: '⛽ পেট্রোল আছে' },
              { value: 'diesel', label: '🛢️ ডিজেল আছে' },
              { value: 'octane', label: '🔥 অকটেন আছে' },
            ]}
          />
          {/* ভিড় ফিল্টার */}
          <FilterSelect
            label="ভিড়ের অবস্থা"
            value={filterCrowd}
            onChange={setFilterCrowd}
            options={[
              { value: 'all',    label: '👥 সব অবস্থা' },
              { value: 'none',   label: '😊 ভিড় নেই' },
              { value: 'medium', label: '😐 মাঝারি ভিড়' },
              { value: 'heavy',  label: '😟 বেশি ভিড়' },
            ]}
          />
          {/* প্রাপ্যতা ফিল্টার */}
          <FilterSelect
            label="প্রাপ্যতা"
            value={filterAvail}
            onChange={setFilterAvail}
            options={[
              { value: 'all',         label: '🔍 সব পাম্প' },
              { value: 'available',   label: '✅ জ্বালানি আছে' },
              { value: 'unavailable', label: '❌ জ্বালানি নেই' },
            ]}
          />
        </div>
        {/* ফিল্টার রিসেট */}
        {(filterFuel !== 'all' || filterCrowd !== 'all' || filterAvail !== 'all' || search) && (
          <button
            onClick={() => { setFilterFuel('all'); setFilterCrowd('all'); setFilterAvail('all'); setSearch('') }}
            className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
          >
            🗑️ সব ফিল্টার মুছুন
          </button>
        )}
      </div>

      {/* ── রেজাল্ট হেডার ── */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-sm">
          {toBengaliNumber(filtered.length)}টি পাম্প পাওয়া গেছে
        </p>
        <Link
          to="/update"
          className="text-sm bg-green-700 hover:bg-green-800 text-white
                     px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-1.5"
        >
          <span>📝</span> আপডেট দিন
        </Link>
      </div>

      {/* ── স্টেশন কার্ড তালিকা ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-lg font-medium">কোনো পাম্প পাওয়া যায়নি</p>
          <p className="text-sm mt-1">অন্য ফিল্টার ব্যবহার করে দেখুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((station, i) => (
            <div
              key={station._id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-in"
            >
              <StationCard station={station} />
            </div>
          ))}
        </div>
      )}

      {/* ── ফুটার নোট ── */}
      <p className="text-center text-xs text-gray-400 pb-4">
        তথ্য প্রতি ৬০ সেকেন্ডে স্বয়ংক্রিয়ভাবে আপডেট হয়
      </p>
    </div>
  )
}

// ── সাব-কম্পোনেন্ট: পরিসংখ্যান বক্স ──────────────────────────────────────────
function StatBox({ icon, value, label, color }) {
  const colors = {
    blue:   'bg-blue-50  border-blue-100  text-blue-700',
    green:  'bg-green-50 border-green-100 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-100 text-yellow-700',
  }
  return (
    <div className={`rounded-2xl border-2 p-4 text-center ${colors[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium mt-0.5 opacity-80">{label}</div>
    </div>
  )
}

// ── সাব-কম্পোনেন্ট: ফিল্টার সিলেক্ট ────────────────────────────────────────
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm
                   text-gray-700 focus:border-green-500 focus:outline-none bg-white
                   cursor-pointer transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
