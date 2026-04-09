// হেডার কম্পোনেন্ট - সাইটের শীর্ষ অংশ
import { Link, useLocation } from 'react-router-dom'

export default function Header({ onRefresh, lastRefresh, loading }) {
  const location = useLocation()

  // কোন পেজে আছি সেটা বোঝার জন্য
  const isHome   = location.pathname === '/'
  const isUpdate = location.pathname === '/update'
  const isAdmin  = location.pathname === '/admin'

  return (
    <header className="bg-green-700 text-white shadow-lg">
      {/* মূল হেডার */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* লোগো ও শিরোনাম */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-4xl group-hover:scale-110 transition-transform">⛽</div>
            <div>
              <h1 className="text-xl font-bold leading-tight">
                জয়পুরহাট জ্বালানি ট্র্যাকার
              </h1>
              <p className="text-green-200 text-sm">
                পেট্রোল পাম্পের সর্বশেষ তথ্য
              </p>
            </div>
          </Link>

          {/* রিফ্রেশ বোতাম (শুধু হোম পেজে) */}
          {isHome && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              title="তথ্য রিফ্রেশ করুন"
            >
              <span className={loading ? 'animate-spin' : ''}>🔄</span>
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          )}
        </div>

        {/* শেষ রিফ্রেশ সময় */}
        {lastRefresh && isHome && (
          <p className="text-green-300 text-xs mt-2 text-right">
            শেষ রিফ্রেশ:{' '}
            {lastRefresh.toLocaleTimeString('bn-BD', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>

      {/* নেভিগেশন ট্যাব */}
      <nav className="bg-green-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex">
            <Link
              to="/"
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                isHome
                  ? 'border-white text-white'
                  : 'border-transparent text-green-300 hover:text-white hover:border-green-400'
              }`}
            >
              🏠 পাম্পের তালিকা
            </Link>
            <Link
              to="/update"
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                isUpdate
                  ? 'border-white text-white'
                  : 'border-transparent text-green-300 hover:text-white hover:border-green-400'
              }`}
            >
              📝 আপডেট দিন
            </Link>
            <Link
              to="/admin"
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                isAdmin
                  ? 'border-white text-white'
                  : 'border-transparent text-green-300 hover:text-white hover:border-green-400'
              }`}
            >
              ⚙️ পাম্প পরিচালনা
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
