import { useEffect, useState } from 'react'
import { api } from '../../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

export default function ManageElectionsPage() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ title: '', start_date: '', end_date: '', is_active: false })

  const load = () => api.get('elections/').then((r) => setRows(r.data))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api.post('elections/', form)
    setForm({ title: '', start_date: '', end_date: '', is_active: false })
    load()
  }

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Manage Elections</h2>
      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submit}>
        <input className={inputClass} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input className={inputClass} type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
        <input className={inputClass} type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
        <label className="inline-flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Create Election</button>
      </form>
      <div className="grid gap-3">
        {rows.map((row) => <div className="rounded-xl border border-slate-200 bg-white p-4" key={row.id}>{row.title}</div>)}
      </div>
    </section>
  )
}
