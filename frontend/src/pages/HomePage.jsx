import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="card">
      <h2>Student Voting Portal</h2>
      <p className="helper-text">
        Verify your student account, view the active election, and submit one vote per position.
      </p>
      <div className="actions-row">
        <Link className="button-link" to="/student/login">
          Student Login
        </Link>
        <Link className="button-link" to="/student/vote">
          Go to Voting Page
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
