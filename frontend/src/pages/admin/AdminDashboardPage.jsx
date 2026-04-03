import { Link } from 'react-router-dom'

const links = [
  { to: '/admin/elections', label: 'Manage Elections' },
  { to: '/admin/positions', label: 'Manage Positions' },
  { to: '/admin/candidates', label: 'Manage Candidates' },
  { to: '/admin/students', label: 'Manage Students' },
  { to: '/admin/results', label: 'View Results' },
]

export default function AdminDashboardPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
      <p className="mt-1 text-sm text-slate-600">Choose an area to manage election operations.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
