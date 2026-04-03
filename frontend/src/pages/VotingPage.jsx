import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { castVote, getActiveElectionPositions, getCandidatesByPosition } from "../api/votingApi";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/apiError";

function VotingPage() {
  const navigate = useNavigate();
  const { isStudentAuthenticated, student } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [election, setElection] = useState(null);
  const [positions, setPositions] = useState([]);
  const [selections, setSelections] = useState({});
  const [submittingPosition, setSubmittingPosition] = useState(null);

  const storageKey = useMemo(() => {
    if (!student?.id || !election?.id) return "";
    return `votes_${student.id}_${election.id}`;
  }, [student?.id, election?.id]);

  const [votedMap, setVotedMap] = useState({});

  useEffect(() => {
    const loadVotingData = async () => {
      setLoading(true);
      setError("");

      try {
        const positionsResponse = await getActiveElectionPositions();
        const electionData = positionsResponse.data?.data?.election;
        const positionItems = positionsResponse.data?.data?.positions || [];

        const withCandidates = await Promise.all(
          positionItems.map(async (position) => {
            const candidatesResponse = await getCandidatesByPosition(position.id);
            return {
              ...position,
              candidates: candidatesResponse.data?.data?.candidates || [],
            };
          })
        );

        setElection(electionData || null);
        setPositions(withCandidates);
      } catch (apiError) {
        setError(extractErrorMessage(apiError, "Unable to load active voting data."));
      } finally {
        setLoading(false);
      }
    };

    loadVotingData();
  }, []);

  useEffect(() => {
    if (!storageKey) return;

    try {
      const raw = localStorage.getItem(storageKey);
      setVotedMap(raw ? JSON.parse(raw) : {});
    } catch {
      setVotedMap({});
    }
  }, [storageKey]);

  const markPositionAsVoted = (positionId) => {
    const updated = { ...votedMap, [positionId]: true };
    setVotedMap(updated);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const submitVote = async (positionId) => {
    const candidateId = selections[positionId];
    if (!candidateId || !election || !student) return;

    setSubmittingPosition(positionId);
    setError("");

    try {
      await castVote({
        student: student.id,
        election: election.id,
        position: positionId,
        candidate: Number(candidateId),
      });

      markPositionAsVoted(positionId);
      navigate("/student/vote/success", {
        state: {
          positionId,
        },
      });
    } catch (apiError) {
      setError(extractErrorMessage(apiError, "Vote submission failed."));
    } finally {
      setSubmittingPosition(null);
    }
  };

  if (!isStudentAuthenticated) {
    return <Navigate to="/student/login" replace />;
  }

  return (
    <section className="card">
      <h2>Voting Page</h2>

      {loading && <p className="status-message">Loading election data...</p>}
      {!loading && error && <p className="error-message">{error}</p>}
      {!loading && !error && election && <p className="helper-text">Active election: {election.name}</p>}
      {!loading && !error && positions.length === 0 && (
        <p className="helper-text">No positions are available for voting right now.</p>
      )}

      {!loading &&
        !error &&
        positions.map((position) => {
          const hasVoted = Boolean(votedMap[position.id]);

          return (
            <article className="card position-card" key={position.id}>
              <h3>{position.title}</h3>
              <p className="helper-text">Choose one candidate:</p>

              {position.candidates?.length ? (
                <div className="candidate-list">
                  {position.candidates.map((candidate) => (
                    <label key={candidate.id} className="candidate-item">
                      <input
                        type="radio"
                        name={`position-${position.id}`}
                        value={candidate.id}
                        disabled={hasVoted}
                        checked={String(selections[position.id] || "") === String(candidate.id)}
                        onChange={(event) =>
                          setSelections((prev) => ({
                            ...prev,
                            [position.id]: event.target.value,
                          }))
                        }
                      />
                      <span>{candidate.full_name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="helper-text">No candidates available for this position.</p>
              )}

              <button
                type="button"
                disabled={
                  hasVoted ||
                  !selections[position.id] ||
                  submittingPosition === position.id ||
                  !position.candidates?.length
                }
                onClick={() => submitVote(position.id)}
              >
                {hasVoted
                  ? "Already voted"
                  : submittingPosition === position.id
                    ? "Submitting..."
                    : "Submit vote"}
              </button>
            </article>
          );
        })}
    </section>
  );
}

export default VotingPage;
