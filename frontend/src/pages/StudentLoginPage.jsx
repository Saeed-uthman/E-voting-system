import { useState } from "react";

import { loginStudent, verifyStudent } from "../api/authApi";

function StudentLoginPage() {
  const [form, setForm] = useState({ student_id: "", email: "" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    setSubmitting(true);
    setStatus("");
    try {
      await verifyStudent(form);
      setStatus("Student verification successful.");
    } catch {
      setStatus("Student verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setSubmitting(true);
    setStatus("");
    try {
      await loginStudent(form);
      setStatus("Student login successful.");
    } catch {
      setStatus("Student login failed.");
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
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" onClick={handleVerify} disabled={submitting}>
          Verify
        </button>
        <button type="button" onClick={handleLogin} disabled={submitting}>
          Login
        </button>
      </div>
      {status && <p className="status-message">{status}</p>}
    </section>
  );
}

export default StudentLoginPage;
