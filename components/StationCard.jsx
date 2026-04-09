// স্টেশন কার্ড কম্পোনেন্ট - প্রতিটি পাম্পের তথ্য কার্ড আকারে দেখায়
import { useState } from 'react'
import FuelBadge from './FuelBadge'
import CrowdBadge from './CrowdBadge'
import HistoryModal from './HistoryModal'
import { timeAgo, toBengaliNumber } from '../utils'

export default function StationCard({ station }) {
  const { name, location, latestUpdate } = station
  const [showHistory, setShowHistory] = useState(false)

  // কোনো জ্বালানি আছে কিনা চেক করা
  const anyFuelAvailable =
    latestUpdate?.petrol || latestUpdate?.diesel || latestUpdate?.octane

  return (
    <>
      <div
        className={`station-card bg-white rounded-2xl shadow-md border-2 overflow-hidden animate-fade-in
          ${anyFuelAvailable ? 'border-green-200' : 'border-red-200'}`}
      >
        {/* কার্ড হেডার */}
        <div
          className={`px-5 py-4 ${
            anyFuelAvailable
              ? 'bg-gradient-to-r from-green-50 to-emerald-50'
              : 'bg-gradient-to-r from-red-50 to-rose-50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* পাম্পের নাম */}
              <h2 className="text-lg font-bold text-gray-800 truncate">{name}</h2>
              {/* অবস্থান */}
              <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                <span>📍</span>
                <span className="truncate">{location}</span>
              </p>
            </div>

            {/* সামগ্রিক স্ট্যাটাস আইকন */}
            <div className="text-3xl flex-shrink-0">
              {anyFuelAvailable ? '✅' : '❌'}
            </div>
          </div>
        </div>

        {/* কার্ড বডি */}
        <div className="px-5 py-4 space-y-4">
          {/* জ্বালানির ব্যাজগুলো */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
              জ্বালানির অবস্থা
            </p>
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map((fuel) => (
                <FuelBadge
                  key={fuel.key}
                  label={fuel.label}
                  available={latestUpdate?.[fuel.key] ?? false}
                  icon={fuel.icon}
                />
              ))}
            </div>
          </div>

          {/* ভিড়ের অবস্থা */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
              ভিড়ের অবস্থা
            </p>
            <CrowdBadge crowd={latestUpdate?.crowd ?? 'none'} />
          </div>
        </div>

        {/* কার্ড ফুটার */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {/* সর্বশেষ আপডেট সময় */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>🕐</span>
            <span>{timeAgo(latestUpdate?.createdAt)}</span>
          </div>

          {/* ইতিহাস বোতাম */}
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm text-green-700 hover:text-green-900 font-medium
                       hover:underline transition-colors flex items-center gap-1"
          >
            <span>📋</span>
            <span>ইতিহাস দেখুন</span>
          </button>
        </div>
      </div>

      {/* ইতিহাস মডাল */}
      {showHistory && (
        <HistoryModal
          station={station}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  )
}
