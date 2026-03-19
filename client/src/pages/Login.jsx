import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-card">
        <div className="brand-mark">
          <svg viewBox="0 0 40 40" fill="none" className="brand-icon">
            <circle cx="20" cy="20" r="18" stroke="url(#g1)" strokeWidth="2" />
            <path
              d="M12 20 L18 26 L28 14"
              stroke="url(#g1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="g1"
                x1="0"
                y1="0"
                x2="40"
                y2="40"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6EE7B7" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="brand-name">AI Mentor</span>
        </div>

        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue your learning journey</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <svg className="input-icon" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2.5 6.5L10 11L17.5 6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect
                  x="2"
                  y="4"
                  width="16"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <svg className="input-icon" viewBox="0 0 20 20" fill="none">
                <rect
                  x="5"
                  y="9"
                  width="10"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 9V6.5a3 3 0 1 1 6 0V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one free</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-page {
          min-height: 100vh;
          background: #050A14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .orb-1 { width: 520px; height: 520px; background: #3B82F6; top: -160px; left: -120px; animation-delay: 0s; }
        .orb-2 { width: 360px; height: 360px; background: #6EE7B7; bottom: -100px; right: -80px; animation-delay: -4s; }
        .orb-3 { width: 280px; height: 280px; background: #8B5CF6; top: 50%; left: 55%; animation-delay: -8s; }

        @keyframes drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.06); }
        }

        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
          animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .brand-mark {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .brand-icon { width: 36px; height: 36px; }
        .brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          background: linear-gradient(135deg, #6EE7B7, #3B82F6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .auth-header { margin-bottom: 28px; }
        .auth-header h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.85rem;
          color: #F0F6FF;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }
        .auth-header p {
          margin-top: 6px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.4);
        }

        .alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.875rem;
          margin-bottom: 20px;
        }
        .alert-error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #FCA5A5;
        }

        .auth-form { display: flex; flex-direction: column; gap: 18px; }

        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: rgba(255,255,255,0.25);
          pointer-events: none;
        }
        .input-wrap input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #E8F0FE;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
        .input-wrap input:focus {
          border-color: rgba(110,231,183,0.5);
          background: rgba(255,255,255,0.09);
          box-shadow: 0 0 0 3px rgba(110,231,183,0.08);
        }

        .btn-primary {
          margin-top: 8px;
          padding: 14px;
          background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
          border: none;
          border-radius: 12px;
          color: #050A14;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(110,231,183,0.2);
        }
        .btn-primary:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(110,231,183,0.3); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .btn-loading { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(5,10,20,0.3);
          border-top-color: #050A14;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-switch {
          margin-top: 24px;
          text-align: center;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.35);
        }
        .auth-switch a {
          color: #6EE7B7;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .auth-switch a:hover { opacity: 0.75; }

        @media (max-width: 480px) {
          .auth-card { padding: 32px 24px; margin: 16px; }
          .auth-header h1 { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}