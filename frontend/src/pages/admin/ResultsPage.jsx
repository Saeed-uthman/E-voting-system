import { useEffect, useState } from 'react'
import { api } from '../../api/client'

export default function ResultsPage() {
  const [elections, setElections] = useState([])
  const [electionId, setElectionId] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    api.get('elections/').then((r) => setElections(r.data))
  }, [])

  const loadResults = async () => {
    const { data } = await api.get(`voting/results/?election_id=${electionId}`)
    setResults(data.results)
  }

  return (
    <section>
      <h2>Election Results</h2>
      <div className="card form-grid">
        <select value={electionId} onChange={(e) => setElectionId(e.target.value)}>
          <option value="">Select election</option>
          {elections.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <button onClick={loadResults} disabled={!electionId}>Load Results</button>
      </div>
      {results.map((position) => (
        <div className="card" key={position.position_id}>
          <h3>{position.position_name}</h3>
          {position.candidates.map((candidate) => (
            <p key={candidate.candidate__id}>{candidate.candidate__full_name}: {candidate.total_votes}</p>
          ))}
        </div>
      ))}
    </section>
  )
}
