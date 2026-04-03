import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

export default function VotingDashboardPage() {
  const [positions, setPositions] = useState([])
  const [election, setElection] = useState(null)
  const [votedPositions, setVotedPositions] = useState([])
  const navigate = useNavigate()
  const student = JSON.parse(localStorage.getItem('student') || 'null')

  useEffect(() => {
    const load = async () => {
      const active = await api.get('voting/active-election/')
      setElection(active.data)
      const ballot = await api.get(`voting/ballot/?election_id=${active.data.id}`)
      setPositions(ballot.data)
      if (student) {
        const status = await api.get(`voting/status/?reg_no=${student.reg_no}&election_id=${active.data.id}`)
        setVotedPositions(status.data.voted_positions)
      }
    }
    load().catch(() => setPositions([]))
  }, [])

  const castVote = async (positionId, candidateId) => {
    await api.post('voting/submit/', {
      reg_no: student.reg_no,
      election: election.id,
      position: positionId,
      candidate: candidateId,
    })
    navigate('/student/success')
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Voting Dashboard</h2>
        <p className="text-sm text-slate-600">{election ? `Active election: ${election.title || 'Current election'}` : 'Loading election details...'}</p>
      </div>

      {positions.map((position) => (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={position.id}>
          <h3 className="text-lg font-semibold text-slate-900">{position.name}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {position.candidates.map((candidate) => (
              <button
                key={candidate.id}
                disabled={votedPositions.includes(position.id)}
                onClick={() => castVote(position.id, candidate.id)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-800 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-slate-200"
              >
                Vote {candidate.full_name}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
