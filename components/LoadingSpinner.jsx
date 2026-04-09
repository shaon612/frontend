// লোডিং স্পিনার কম্পোনেন্ট
export default function LoadingSpinner({ message = 'লোড হচ্ছে...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* স্পিনার অ্যানিমেশন */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-green-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent
                        border-t-green-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          ⛽
        </div>
      </div>
      <p className="text-gray-500 text-base font-medium">{message}</p>
    </div>
  )
}
