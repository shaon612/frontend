// এরর মেসেজ কম্পোনেন্ট
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 gap-4">
      <div className="text-5xl">😞</div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-red-700 mb-1">সমস্যা হয়েছে</h3>
        <p className="text-gray-500 text-sm max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 bg-green-700 hover:bg-green-800 text-white
                     px-6 py-2.5 rounded-xl font-medium transition-colors
                     flex items-center gap-2"
        >
          <span>🔄</span> আবার চেষ্টা করুন
        </button>
      )}
    </div>
  )
}
