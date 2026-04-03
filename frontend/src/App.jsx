import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/layout/NavBar'
import HomePage from './pages/student/HomePage'
import StudentLoginPage from './pages/student/StudentLoginPage'
import VotingDashboardPage from './pages/student/VotingDashboardPage'
import VoteSuccessPage from './pages/student/VoteSuccessPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import ManageElectionsPage from './pages/admin/ManageElectionsPage'
import ManagePositionsPage from './pages/admin/ManagePositionsPage'
import ManageCandidatesPage from './pages/admin/ManageCandidatesPage'
import ManageStudentsPage from './pages/admin/ManageStudentsPage'
import ResultsPage from './pages/admin/ResultsPage'
import { setAdminToken } from './api/client'

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem('admin_access')
    if (token) setAdminToken(token)
  }, [])

  return (
    <div>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/student/vote" element={<VotingDashboardPage />} />
          <Route path="/student/success" element={<VoteSuccessPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/elections" element={<ManageElectionsPage />} />
          <Route path="/admin/positions" element={<ManagePositionsPage />} />
          <Route path="/admin/candidates" element={<ManageCandidatesPage />} />
          <Route path="/admin/students" element={<ManageStudentsPage />} />
          <Route path="/admin/results" element={<ResultsPage />} />
        </Routes>
      </main>
    </div>
  )
}
