import { useEffect, useState } from 'react'
import { api } from '../../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

export default function ManagePositionsPage() {
  const [rows, setRows] = useState([])
  const [elections, setElections] = useState([])
  const [form, setForm] = useState({ election: '', name: '', description: '' })

  const load = () => api.get('elections/positions/').then((r) => setRows(r.data))
  useEffect(() => {
    load()
    api.get('elections/').then((r) => setElections(r.data))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api.post('elections/positions/', form)
    setForm({ election: '', name: '', description: '' })
    load()
  }

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Manage Positions</h2>
      <form className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={submit}>
        <select className={inputClass} value={form.election} onChange={(e) => setForm({ ...form, election: e.target.value })} required>
          <option value="">Select election</option>
          {elections.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <input className={inputClass} placeholder="Position Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea className={inputClass} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">Create Position</button>
      </form>
      <div className="grid gap-3">
        {rows.map((row) => <div className="rounded-xl border border-slate-200 bg-white p-4" key={row.id}>{row.name}</div>)}
      </div>
    </section>
  )
}
