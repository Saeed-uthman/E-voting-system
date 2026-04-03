import { useEffect, useState } from 'react'
import { api } from '../../api/client'

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
    <section>
      <h2>Manage Candidates</h2>
      <form className="form-grid card" onSubmit={submit}>
        <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required>
          <option value="">Select position</option>
          {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <textarea placeholder="Manifesto" value={form.manifesto} onChange={(e) => setForm({ ...form, manifesto: e.target.value })} />
        <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        <button type="submit">Create Candidate</button>
      </form>
      {rows.map((row) => <div className="card" key={row.id}>{row.full_name}</div>)}
    </section>
  )
}
