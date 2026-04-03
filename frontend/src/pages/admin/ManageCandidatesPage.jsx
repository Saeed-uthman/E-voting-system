import { useEffect, useState } from 'react'
import { api } from '../../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

export default function ManageCandidatesPage() {
  const [rows, setRows] = useState([])
  const [positions, setPositions] = useState([])
  const [form, setForm] = useState({ position: '', full_name: '', manifesto: '', image_url: '' })

  const load = () => api.get('elections/candidates/').then((r) => setRows(r.data))
  useEffect(() => {
    load()
    api.get('elections/positions/').then((r) => setPositions(r.data))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api.post('elections/candidates/', form)
    setForm({ position: '', full_name: '', manifesto: '', image_url: '' })
    load()
  }

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Manage Candidates</h2>
      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submit}>
        <select className={inputClass} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required>
          <option value="">Select position</option>
          {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input className={inputClass} placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <textarea className={inputClass} placeholder="Manifesto" value={form.manifesto} onChange={(e) => setForm({ ...form, manifesto: e.target.value })} />
        <input className={inputClass} placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Create Candidate</button>
      </form>
      <div className="grid gap-3">
        {rows.map((row) => <div className="rounded-xl border border-slate-200 bg-white p-4" key={row.id}>{row.full_name}</div>)}
      </div>
    </section>
  )
}
