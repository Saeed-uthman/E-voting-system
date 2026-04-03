import { useEffect, useState } from 'react'
import { api } from '../../api/client'

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
    <section>
      <h2>Manage Positions</h2>
      <form className="form-grid card" onSubmit={submit}>
        <select value={form.election} onChange={(e) => setForm({ ...form, election: e.target.value })} required>
          <option value="">Select election</option>
          {elections.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <input placeholder="Position Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Create Position</button>
      </form>
      {rows.map((row) => <div className="card" key={row.id}>{row.name}</div>)}
    </section>
  )
}
