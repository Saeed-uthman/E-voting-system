import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAdminToken } from '../../api/client'

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
    <section className="card">
      <h2>Admin Login</h2>
      <form onSubmit={submit} className="form-grid">
        <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  )
}
