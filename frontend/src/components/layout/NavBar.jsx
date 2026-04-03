import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="nav">
      <h1>NUK Voting</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/student/login">Student</Link>
        <Link to="/admin/login">Admin</Link>
      </div>
    </nav>
  )
}
