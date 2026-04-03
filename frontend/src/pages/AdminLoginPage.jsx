import { useState } from "react";

import { adminLogin } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/apiError";

function AdminLoginPage() {
  const { setAdminSession } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    setError("");

    try {
      const response = await adminLogin(form);
      setAdminSession(response.data?.data?.tokens || {});
      setStatus(response.data?.message || "Admin login successful.");
    } catch (apiError) {
      setError(extractErrorMessage(apiError, "Unable to login as admin."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {status && <p className="status-message">{status}</p>}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default AdminLoginPage;
