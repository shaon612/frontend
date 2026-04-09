// আপডেট পেজ - জ্বালানির নতুন তথ্য জমা দেওয়ার জন্য
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchStations, submitUpdate } from '../api'
import { FUEL_TYPES, CROWD_CONFIG } from '../utils'

// ভিড়ের অপশনগুলো
const CROWD_OPTIONS = [
  { value: 'none',   label: 'ভিড় নেই',     emoji: '😊', desc: 'সরাসরি যাওয়া যাবে' },
  { value: 'medium', label: 'মাঝারি ভিড়',  emoji: '😐', desc: '১০–২০ মিনিট অপেক্ষা' },
  { value: 'heavy',  label: 'বেশি ভিড়',    emoji: '😟', desc: '৩০+ মিনিট অপেক্ষা' },
]

export default function UpdatePage() {
  const navigate = useNavigate()

  // স্টেশনের তালিকা
  const [stations,     setStations]     = useState([])
  const [loadingStns,  setLoadingStns]  = useState(true)

  // ফর্মের অবস্থা
  const [form, setForm] = useState({
    stationId:    '',
    petrol:       false,
    diesel:       false,
    octane:       false,
    crowd:        'none',
    reporterName: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  // পেজ লোডে স্টেশন আনা
  useEffect(() => {
    fetchStations()
      .then(setStations)
      .catch(() => toast.error('পাম্পের তালিকা লোড করতে সমস্যা হয়েছে'))
      .finally(() => setLoadingStns(false))
  }, [])

  // চেকবক্স / সিলেক্ট পরিবর্তন
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ভিড় সিলেক্ট করা
  const selectCrowd = (value) => {
    setForm((prev) => ({ ...prev, crowd: value }))
  }

  // ফর্ম জমা দেওয়া
  const handleSubmit = async (e) => {
    e.preventDefault()

    // যাচাই
    if (!form.stationId) {
      toast.error('পাম্প নির্বাচন করুন')
      return
    }
    if (!form.petrol && !form.diesel && !form.octane) {
      toast.error('অন্তত একটি জ্বালানি নির্বাচন করুন')
      return
    }

    setSubmitting(true)
    try {
      await submitUpdate(form)
      setSubmitted(true)
      toast.success('তথ্য সফলভাবে জমা দেওয়া হয়েছে! ধন্যবাদ 🙏')
    } catch (err) {
      const msg = err.response?.data?.message || 'তথ্য জমা দিতে সমস্যা হয়েছে'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // ── সফলভাবে জমা দেওয়ার পরের স্ক্রিন ──────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-10 space-y-6">
          <div className="text-7xl">🎉</div>
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">ধন্যবাদ!</h2>
            <p className="text-gray-500 leading-relaxed">
              আপনার তথ্য সফলভাবে জমা হয়েছে।<br />
              আপনার সহযোগিতায় অন্যরা সঠিক তথ্য পাবেন।
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setSubmitted(false); setForm({ stationId: '', petrol: false, diesel: false, octane: false, crowd: 'none', reporterName: '' }) }}
              className="bg-green-700 hover:bg-green-800 text-white font-bold
                         py-3 px-6 rounded-xl transition-colors"
            >
              📝 আরেকটি আপডেট দিন
            </button>
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium
                         py-3 px-6 rounded-xl transition-colors text-center"
            >
              🏠 হোম পেজে যান
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── মূল ফর্ম ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* পেজ হেডার */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">📝 তথ্য আপডেট করুন</h1>
        <p className="text-gray-500 text-sm">
          আপনার এলাকার পাম্পের জ্বালানির সর্বশেষ তথ্য জানান
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ─── ধাপ ১: পাম্প নির্বাচন ─────────────────────────────────────── */}
        <FormSection step="১" title="পাম্প নির্বাচন করুন">
          {loadingStns ? (
            <div className="text-center py-4 text-gray-400">⏳ লোড হচ্ছে...</div>
          ) : (
            <select
              name="stationId"
              value={form.stationId}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3
                         focus:border-green-500 focus:outline-none text-gray-800
                         bg-white cursor-pointer transition-colors text-base"
            >
              <option value="">-- পাম্প নির্বাচন করুন --</option>
              {stations.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} — {s.location}
                </option>
              ))}
            </select>
          )}
        </FormSection>

        {/* ─── ধাপ ২: জ্বালানির তথ্য ────────────────────────────────────── */}
        <FormSection step="২" title="কোন জ্বালানি আছে?">
          <p className="text-xs text-gray-400 mb-3">যে জ্বালানিগুলো পাওয়া যাচ্ছে সেগুলো টিক দিন</p>
          <div className="space-y-2">
            {FUEL_TYPES.map((fuel) => (
              <label
                key={fuel.key}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer
                             transition-all select-none
                             ${form[fuel.key]
                               ? 'border-green-400 bg-green-50'
                               : 'border-gray-200 bg-white hover:border-gray-300'
                             }`}
              >
                <input
                  type="checkbox"
                  name={fuel.key}
                  checked={form[fuel.key]}
                  onChange={handleChange}
                  className="w-5 h-5 accent-green-600 cursor-pointer"
                />
                <span className="text-xl">{fuel.icon}</span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">{fuel.label}</span>
                </div>
                {form[fuel.key] && (
                  <span className="text-green-600 font-bold text-sm">✓ আছে</span>
                )}
              </label>
            ))}
          </div>
        </FormSection>

        {/* ─── ধাপ ৩: ভিড়ের তথ্য ────────────────────────────────────────── */}
        <FormSection step="৩" title="ভিড়ের অবস্থা কেমন?">
          <div className="grid grid-cols-3 gap-2">
            {CROWD_OPTIONS.map((opt) => {
              const cfg = CROWD_CONFIG[opt.value]
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => selectCrowd(opt.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all
                               ${form.crowd === opt.value
                                 ? `${cfg.border} ${cfg.bg} ring-2 ring-offset-1 ring-current`
                                 : 'border-gray-200 bg-white hover:border-gray-300'
                               }`}
                >
                  <div className="text-2xl mb-1">{opt.emoji}</div>
                  <div className={`text-xs font-bold ${form.crowd === opt.value ? cfg.text : 'text-gray-700'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 leading-tight">{opt.desc}</div>
                </button>
              )
            })}
          </div>
        </FormSection>

        {/* ─── ধাপ ৪: আপনার নাম (ঐচ্ছিক) ─────────────────────────────────── */}
        <FormSection step="৪" title="আপনার নাম (ঐচ্ছিক)">
          <input
            type="text"
            name="reporterName"
            value={form.reporterName}
            onChange={handleChange}
            placeholder="আপনার নাম লিখুন (না লিখলেও হবে)"
            maxLength={50}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3
                       focus:border-green-500 focus:outline-none text-gray-800
                       placeholder-gray-300 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            আপনার নাম অন্যরা দেখতে পাবেন
          </p>
        </FormSection>

        {/* ─── জমা দেওয়ার বোতাম ──────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={submitting || loadingStns}
          className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60
                     disabled:cursor-not-allowed text-white font-bold text-lg
                     py-4 rounded-2xl transition-colors shadow-lg
                     flex items-center justify-center gap-2"
        >
          {submitting ? (
            <><span className="animate-spin text-xl">⏳</span> জমা হচ্ছে...</>
          ) : (
            <><span className="text-xl">✅</span> তথ্য জমা দিন</>
          )}
        </button>

        {/* নোট */}
        <p className="text-center text-xs text-gray-400">
          একই পাম্পে ৫ মিনিটে একবারের বেশি আপডেট দেওয়া যাবে না
        </p>
      </form>
    </div>
  )
}

// ── সাব-কম্পোনেন্ট: ফর্ম সেকশন ──────────────────────────────────────────────
function FormSection({ step, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-7 h-7 rounded-full bg-green-700 text-white text-sm
                         font-bold flex items-center justify-center flex-shrink-0">
          {step}
        </span>
        <h2 className="font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  )
}
