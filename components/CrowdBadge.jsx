// ভিড়ের ব্যাজ কম্পোনেন্ট - ভিড়ের পরিমাণ দেখায়
import { getCrowdInfo } from '../utils'

export default function CrowdBadge({ crowd }) {
  const info = getCrowdInfo(crowd)

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border
        ${info.bg} ${info.text} ${info.border}`}
    >
      {/* রঙিন ডট */}
      <span className={`w-2 h-2 rounded-full ${info.dot} animate-pulse-slow`} />
      {/* ইমোজি */}
      <span>{info.emoji}</span>
      {/* লেবেল */}
      <span>{info.label}</span>
    </div>
  )
}
