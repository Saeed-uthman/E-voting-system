import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginStudent, verifyStudent } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

function StudentLoginPage() {
  const navigate = useNavigate();
  const { setStudentAuth } = useAuth();
  const [form, setForm] = useState({ student_id: "", email: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    setSubmitting(true);
    setStatus("");
    setError("");
    try {
      await verifyStudent(form);
      setStatus("Verification successful. You can now login.");
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Student verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setSubmitting(true);
    setStatus("");
    setError("");
    try {
      const response = await loginStudent(form);
      const payload = response.data?.data;
      setStudentAuth(payload || null);
      setStatus("Student login successful.");
      navigate("/student/vote");
    } catch (apiError) {
      setError(apiError.response?.data?.detail || "Student login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Student Verification / Login</h2>
      <div className="form-row">
        <label htmlFor="student_id">Student ID</label>
        <input
          id="student_id"
          value={form.student_id}
          onChange={(event) => setForm((prev) => ({ ...prev, student_id: event.target.value }))}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>
      <div className="actions-row">
        <button type="button" onClick={handleVerify} disabled={submitting}>
          {submitting ? "Verifying..." : "Verify"}
        </button>
        <button type="button" onClick={handleLogin} disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </div>
      {status && <p className="status-message">{status}</p>}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default StudentLoginPage;
