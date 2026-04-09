// ইউটিলিটি ফাংশন - বাংলায় বিভিন্ন তথ্য ফরম্যাট করার জন্য

// ── সময় ফরম্যাট ───────────────────────────────────────────────────────────────
// শেষ আপডেটের সময় বাংলায় দেখায় (যেমন: "৫ মিনিট আগে")
export function timeAgo(dateString) {
  if (!dateString) return 'কোনো আপডেট নেই'

  const now     = new Date()
  const updated = new Date(dateString)
  const diffMs  = now - updated
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHr  = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1)   return 'এইমাত্র আপডেট হয়েছে'
  if (diffMin < 60)  return `${toBengaliNumber(diffMin)} মিনিট আগে`
  if (diffHr < 24)   return `${toBengaliNumber(diffHr)} ঘণ্টা আগে`
  if (diffDay < 7)   return `${toBengaliNumber(diffDay)} দিন আগে`
  return 'অনেক আগে'
}

// সম্পূর্ণ সময় বাংলায় ফরম্যাট করা (যেমন: ৩ ফেব্রুয়ারি, রাত ১০:৩০)
export function formatDateTime(dateString) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  return d.toLocaleString('bn-BD', {
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// ── ভিড়ের তথ্য ───────────────────────────────────────────────────────────────
export const CROWD_CONFIG = {
  none: {
    label: 'ভিড় নেই',
    emoji: '😊',
    bg:   'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    dot:  'bg-green-500',
  },
  medium: {
    label: 'মাঝারি ভিড়',
    emoji: '😐',
    bg:   'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    dot:  'bg-yellow-500',
  },
  heavy: {
    label: 'বেশি ভিড়',
    emoji: '😟',
    bg:   'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    dot:  'bg-red-500',
  },
}

export function getCrowdInfo(crowd) {
  return CROWD_CONFIG[crowd] || CROWD_CONFIG.none
}

// ── জ্বালানির তথ্য ────────────────────────────────────────────────────────────
export const FUEL_TYPES = [
  { key: 'petrol', label: 'পেট্রোল', icon: '⛽', color: 'blue' },
  { key: 'diesel', label: 'ডিজেল',  icon: '🛢️', color: 'gray'  },
  { key: 'octane', label: 'অকটেন',  icon: '🔥', color: 'orange'},
]

// ── বাংলা সংখ্যা রূপান্তর ────────────────────────────────────────────────────
const BENGALI_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯']

export function toBengaliNumber(num) {
  return String(num).replace(/[0-9]/g, d => BENGALI_DIGITS[d])
}

// পাম্পের স্ট্যাটাস সারাংশ তৈরি করা
export function getStationSummary(update) {
  if (!update) return 'কোনো তথ্য নেই'
  const available = []
  if (update.petrol) available.push('পেট্রোল')
  if (update.diesel) available.push('ডিজেল')
  if (update.octane) available.push('অকটেন')
  if (available.length === 0) return 'কোনো জ্বালানি নেই'
  return available.join(', ') + ' পাওয়া যাচ্ছে'
}
