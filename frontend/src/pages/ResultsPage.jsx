import { useEffect, useState } from "react";

import { getResults } from "../api/votingApi";

function ResultsPage() {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Loading results...");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getResults();
        setResults(response.data?.data?.positions || []);
        setStatus("");
      } catch {
        setStatus("Results are unavailable or require admin access.");
      }
    };

    fetchResults();
  }, []);

  return (
    <section className="card">
      <h2>Election Results</h2>
      {status && <p className="status-message">{status}</p>}
      {!status && (
        <ul>
          {results.map((position) => (
            <li key={position.position_id}>
              <strong>{position.position_title}</strong> - {position.results.length} candidates
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ResultsPage;
