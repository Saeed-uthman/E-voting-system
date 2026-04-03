import { Link } from 'react-router-dom'

const linkClass = 'rounded-md px-3 py-2 text-sm font-medium text-blue-50 transition hover:bg-blue-700 hover:text-white'

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-20 border-b border-blue-700 bg-gradient-to-r from-brand-900 to-brand-700 text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-lg font-bold tracking-wide">NUK E-Voting System</p>
          <p className="text-xs text-blue-100">Transparent, secure, and easy voting workflow</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/" className={linkClass}>Home</Link>
          <Link to="/student/login" className={linkClass}>Student Portal</Link>
          <Link to="/admin/login" className={linkClass}>Admin Portal</Link>
        </div>
      </div>
    </nav>
  )
}
