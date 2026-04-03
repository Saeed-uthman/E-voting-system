import { useEffect, useState } from 'react'
import { api } from '../../api/client'

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
    <section>
      <h2>Manage Elections</h2>
      <form className="form-grid card" onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required />
        <input type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required />
        <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
        <button type="submit">Create Election</button>
      </form>
      {rows.map((row) => <div className="card" key={row.id}>{row.title}</div>)}
    </section>
  )
}
