import { useEffect, useState } from 'react'
import { api } from '../../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

export default function ManageStudentsPage() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ reg_no: '', full_name: '', department: '', level: '', password: '', is_active: true })

  const load = () => api.get('auth/students/').then((r) => setRows(r.data))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api.post('auth/students/', form)
    setForm({ reg_no: '', full_name: '', department: '', level: '', password: '', is_active: true })
    load()
  }

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Manage Students</h2>
      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submit}>
        <input className={inputClass} placeholder="Reg No" value={form.reg_no} onChange={(e) => setForm({ ...form, reg_no: e.target.value })} required />
        <input className={inputClass} placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input className={inputClass} placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
        <input className={inputClass} placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} required />
        <input className={inputClass} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Register Student</button>
      </form>
      <div className="grid gap-3">
        {rows.map((row) => <div className="rounded-xl border border-slate-200 bg-white p-4" key={row.id}>{row.reg_no} - {row.full_name}</div>)}
      </div>
    </section>
  )
}
