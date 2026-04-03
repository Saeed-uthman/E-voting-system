import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAdminToken } from '../../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('auth/admin/login/', form)
      localStorage.setItem('admin_access', data.access)
      setAdminToken(data.access)
      navigate('/admin')
    } catch {
      setError('Invalid admin credentials')
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input className={inputClass} placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input className={inputClass} placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">Login</button>
      </form>
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
    </section>
  )
}
