// স্টেশন ফর্ম মডাল - নতুন পাম্প যোগ করা ও সম্পাদনা করার জন্য
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { addStation, updateStation } from '../src/api'

export default function StationFormModal({ station, onClose, onSuccess }) {
  // ফর্মের অবস্থা
  const [form, setForm]       = useState({ name: '', location: '', isActive: true })
  const [saving, setSaving]   = useState(false)
  const isEdit                = Boolean(station) // সম্পাদনা মোড কিনা

  // সম্পাদনা মোডে পুরনো তথ্য ফর্মে বসানো
  useEffect(() => {
    if (station) {
      setForm({
        name:     station.name     || '',
        location: station.location || '',
        isActive: station.isActive ?? true,
      })
    }
  }, [station])

  // ESC চাপলে মডাল বন্ধ
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  // ইনপুট পরিবর্তন হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ফর্ম জমা দেওয়া
  const handleSubmit = async (e) => {
    e.preventDefault()

    // যাচাই
    if (!form.name.trim()) {
      toast.error('পাম্পের নাম লিখুন')
      return
    }
    if (!form.location.trim()) {
      toast.error('অবস্থান লিখুন')
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        await updateStation(station._id, form)
        toast.success('পাম্পের তথ্য আপডেট হয়েছে!')
      } else {
        await addStation(form)
        toast.success('নতুন পাম্প যোগ করা হয়েছে!')
      }
      onSuccess()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'সংরক্ষণ করতে সমস্যা হয়েছে')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* হেডার */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-lg">
            {isEdit ? '✏️ পাম্প সম্পাদনা' : '➕ নতুন পাম্প যোগ'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center
                       justify-center rounded-lg hover:bg-gray-100 text-xl"
          >✕</button>
        </div>

        {/* ফর্ম */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* পাম্পের নাম */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              পাম্পের নাম <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="যেমন: মেঘনা পেট্রোলিয়াম"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5
                         focus:border-green-500 focus:outline-none text-gray-800
                         placeholder-gray-300 transition-colors"
            />
          </div>

          {/* অবস্থান */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              অবস্থান <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="যেমন: ঢাকা রোড, জয়পুরহাট সদর"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5
                         focus:border-green-500 focus:outline-none text-gray-800
                         placeholder-gray-300 transition-colors"
            />
          </div>

          {/* সক্রিয় কিনা (সম্পাদনা মোডে) */}
          {isEdit && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  form.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform
                                  absolute top-0.5 ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {form.isActive ? '✅ সক্রিয় পাম্প' : '❌ নিষ্ক্রিয় পাম্প'}
              </span>
            </label>
          )}

          {/* বোতামগুলো */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700
                         font-medium py-2.5 rounded-xl transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-60
                         text-white font-bold py-2.5 rounded-xl transition-colors
                         flex items-center justify-center gap-2"
            >
              {saving ? (
                <><span className="animate-spin">⏳</span> সংরক্ষণ হচ্ছে...</>
              ) : (
                <><span>💾</span> সংরক্ষণ করুন</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
