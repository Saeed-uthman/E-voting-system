import { Link } from 'react-router-dom'

export default function AdminDashboardPage() {
  return (
    <section className="card">
      <h2>Admin Dashboard</h2>
      <div className="list-links">
        <Link to="/admin/elections">Manage Elections</Link>
        <Link to="/admin/positions">Manage Positions</Link>
        <Link to="/admin/candidates">Manage Candidates</Link>
        <Link to="/admin/students">Manage Students</Link>
        <Link to="/admin/results">View Results</Link>
      </div>
    </section>
  )
}
