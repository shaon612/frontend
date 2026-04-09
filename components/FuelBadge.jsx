// জ্বালানি ব্যাজ কম্পোনেন্ট - পেট্রোল/ডিজেল/অকটেন আছে কিনা দেখায়
export default function FuelBadge({ label, available, icon }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border
        ${available
          ? 'bg-green-50 text-green-800 border-green-300 badge-available'
          : 'bg-red-50 text-red-700 border-red-200'
        }`}
    >
      {/* আইকন */}
      <span className="text-base">{icon}</span>

      {/* জ্বালানির নাম */}
      <span>{label}</span>

      {/* স্ট্যাটাস চিহ্ন */}
      <span className="font-bold">
        {available ? '✓' : '✗'}
      </span>
    </div>
  )
}
