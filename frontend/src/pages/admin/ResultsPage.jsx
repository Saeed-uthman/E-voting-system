import { useEffect, useState } from 'react'
import { api } from '../../api/client'

const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

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
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-900">Election Results</h2>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto]">
        <select className={inputClass} value={electionId} onChange={(e) => setElectionId(e.target.value)}>
          <option value="">Select election</option>
          {elections.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <button onClick={loadResults} disabled={!electionId} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Load Results</button>
      </div>
      {results.map((position) => (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={position.position_id}>
          <h3 className="text-lg font-semibold text-slate-900">{position.position_name}</h3>
          <div className="mt-3 space-y-2">
            {position.candidates.map((candidate) => (
              <p key={candidate.candidate__id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <span className="font-semibold">{candidate.candidate__full_name}</span>: {candidate.total_votes} votes
              </p>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
