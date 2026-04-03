import { useEffect, useState } from "react";

import { getActiveElection, getActiveElectionPositions } from "../api/votingApi";

function ActiveElectionPage() {
  const [election, setElection] = useState(null);
  const [positions, setPositions] = useState([]);
  const [status, setStatus] = useState("Loading active election...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionResponse = await getActiveElection();
        const positionsResponse = await getActiveElectionPositions();

        setElection(electionResponse.data?.data || null);
        setPositions(positionsResponse.data?.data?.positions || []);
        setStatus("");
      } catch {
        setStatus("No active election data available right now.");
      }
    };

    fetchData();
  }, []);

  return (
    <section className="card">
      <h2>Active Election</h2>
      {status && <p className="status-message">{status}</p>}
      {election && (
        <>
          <p>
            <strong>{election.name}</strong>
          </p>
          <p className="helper-text">{election.description || "No description provided."}</p>
          <h3>Positions</h3>
          <ul>
            {positions.map((position) => (
              <li key={position.id}>{position.title}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default ActiveElectionPage;
