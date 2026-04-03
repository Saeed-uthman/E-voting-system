import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

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
    <section className="card">
      <h2>Student Login</h2>
      <form onSubmit={submit} className="form-grid">
        <input placeholder="Registration Number" value={form.reg_no} onChange={(e) => setForm({ ...form, reg_no: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Verify & Continue</button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  )
}
