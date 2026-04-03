import { Link, useLocation } from "react-router-dom";

function VoteSuccessPage() {
  const location = useLocation();
  const positionId = location.state?.positionId;

  return (
    <section className="card">
      <h2>Vote Submitted</h2>
      <p className="status-message">Your vote has been recorded successfully.</p>
      {positionId && <p className="helper-text">Position ID: {positionId}</p>}
      <div className="actions-row">
        <Link className="button-link" to="/student/vote">
          Back to Voting Page
        </Link>
        <Link className="button-link" to="/">
          Go Home
        </Link>
      </div>
    </section>
  );
}

export default VoteSuccessPage;
