import { useEffect, useState } from "react";

import { getActiveElectionPositions } from "../api/votingApi";
import { extractErrorMessage } from "../utils/apiError";

function ActiveElectionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [election, setElection] = useState(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const positionsResponse = await getActiveElectionPositions();
        setElection(positionsResponse.data?.data?.election || null);
        setPositions(positionsResponse.data?.data?.positions || []);
      } catch (apiError) {
        setError(extractErrorMessage(apiError, "No active election data available right now."));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="card">
      <h2>Active Election</h2>

      {loading && <p className="status-message">Loading active election...</p>}
      {!loading && error && <p className="error-message">{error}</p>}

      {!loading && !error && election && (
        <>
          <p>
            <strong>{election.name}</strong>
          </p>
          <p className="helper-text">{election.description || "No description provided."}</p>

          <h3>Positions</h3>
          {positions.length === 0 ? (
            <p className="helper-text">No positions have been published for this election yet.</p>
          ) : (
            <ul>
              {positions.map((position) => (
                <li key={position.id}>{position.title}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

export default ActiveElectionPage;
