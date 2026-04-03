import { useEffect, useState } from 'react'
import { api } from '../../api/client'

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
    <section>
      <h2>Manage Students</h2>
      <form className="form-grid card" onSubmit={submit}>
        <input placeholder="Reg No" value={form.reg_no} onChange={(e) => setForm({ ...form, reg_no: e.target.value })} required />
        <input placeholder="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
        <input placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} required />
        <input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
        <button type="submit">Register Student</button>
      </form>
      {rows.map((row) => <div className="card" key={row.id}>{row.reg_no} - {row.full_name}</div>)}
    </section>
  )
}
