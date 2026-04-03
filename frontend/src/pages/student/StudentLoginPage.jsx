import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

export default function StudentLoginPage() {
  const [form, setForm] = useState({ reg_no: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('auth/students/login/', form)
      localStorage.setItem('student', JSON.stringify(data))
      navigate('/student/vote')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-slate-900">Student Login</h2>
      <p className="mt-1 text-sm text-slate-600">Enter your student credentials to access the ballot.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <input className={inputClass} placeholder="Registration Number" value={form.reg_no} onChange={(e) => setForm({ ...form, reg_no: e.target.value })} required />
        <input className={inputClass} placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Verify & Continue</button>
      </form>
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
    </section>
  )
}
