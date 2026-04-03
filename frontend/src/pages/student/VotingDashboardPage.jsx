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
    <section>
      <h2>Voting Dashboard</h2>
      {positions.map((position) => (
        <div className="card" key={position.id}>
          <h3>{position.name}</h3>
          {position.candidates.map((candidate) => (
            <button key={candidate.id} disabled={votedPositions.includes(position.id)} onClick={() => castVote(position.id, candidate.id)}>
              Vote {candidate.full_name}
            </button>
          ))}
        </div>
      ))}
    </section>
  )
}
