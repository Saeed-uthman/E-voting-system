import { useEffect, useState } from "react";

import { getResults } from "../api/votingApi";
import { extractErrorMessage } from "../utils/apiError";

function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getResults();
        setResults(response.data?.data?.positions || []);
      } catch (apiError) {
        setError(extractErrorMessage(apiError, "Results are unavailable or require admin access."));
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <section className="card">
      <h2>Election Results</h2>
      {loading && <p className="status-message">Loading results...</p>}
      {!loading && error && <p className="error-message">{error}</p>}
      {!loading && !error && results.length === 0 && <p className="helper-text">No vote results available yet.</p>}

      {!loading && !error && results.length > 0 && (
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
