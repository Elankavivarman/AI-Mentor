import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "student", label: "Student", emoji: "🎓" },
    { value: "professional", label: "Professional", emoji: "💼" },
    { value: "career_changer", label: "Career Changer", emoji: "🔀" },
  ];

  return (
    <div className="auth-page">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-card">
        <div className="brand-mark">
          <svg viewBox="0 0 40 40" fill="none" className="brand-icon">
            <circle cx="20" cy="20" r="18" stroke="url(#g2)" strokeWidth="2" />
            <path
              d="M12 20 L18 26 L28 14"
              stroke="url(#g2)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="g2"
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
          <h1>Start learning smarter</h1>
          <p>Create your free account in seconds</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role selector */}
          <div className="field-group">
            <label>I am a…</label>
            <div className="role-grid">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  className={`role-btn ${
                    form.role === r.value ? "active" : ""
                  }`}
                  onClick={() => setForm({ ...form, role: r.value })}
                >
                  <span className="role-emoji">{r.emoji}</span>
                  <span className="role-label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrap">
              <svg className="input-icon" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="7"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Alex Johnson"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className="two-col">
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
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="confirmPassword">Confirm</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7 10l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="3"
                    width="14"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Password strength bar */}
          {form.password && (
            <div className="strength-wrap">
              <div className="strength-bar">
                <div
                  className={`strength-fill strength-${
                    form.password.length < 6
                      ? "weak"
                      : form.password.length < 10
                      ? "medium"
                      : "strong"
                  }`}
                  style={{
                    width: `${Math.min(
                      (form.password.length / 12) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <span className="strength-label">
                {form.password.length < 6
                  ? "Weak"
                  : form.password.length < 10
                  ? "Good"
                  : "Strong"}
              </span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" /> Creating account…
              </span>
            ) : (
              "Create Account →"
            )}
          </button>

          <p className="terms">
            By signing up you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>
          </p>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/">Sign in</Link>
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
          padding: 24px 0;
        }
        .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.18; animation: drift 12s ease-in-out infinite alternate; }
        .orb-1 { width: 520px; height: 520px; background: #8B5CF6; top: -160px; right: -120px; }
        .orb-2 { width: 360px; height: 360px; background: #3B82F6; bottom: -100px; left: -80px; animation-delay: -5s; }
        .orb-3 { width: 240px; height: 240px; background: #6EE7B7; top: 40%; left: 10%; animation-delay: -9s; }
        @keyframes drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(25px, 15px) scale(1.05); }
        }

        .auth-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 460px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07);
          animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .brand-mark { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
        .brand-icon { width: 36px; height: 36px; }
        .brand-name {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.2rem;
          background: linear-gradient(135deg, #6EE7B7, #3B82F6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        .auth-header { margin-bottom: 24px; }
        .auth-header h1 {
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.75rem;
          color: #F0F6FF; letter-spacing: -0.04em; line-height: 1.1;
        }
        .auth-header p { margin-top: 6px; font-size: 0.9rem; color: rgba(255,255,255,0.4); }

        .alert { padding: 12px 16px; border-radius: 10px; font-size: 0.875rem; margin-bottom: 16px; }
        .alert-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #FCA5A5; }

        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-group label { font-size: 0.78rem; font-weight: 500; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }

        .role-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .role-btn {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 10px 6px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .role-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); }
        .role-btn.active { background: rgba(110,231,183,0.1); border-color: rgba(110,231,183,0.45); color: #6EE7B7; }
        .role-emoji { font-size: 1.2rem; }
        .role-label { font-size: 0.75rem; font-weight: 500; }

        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: rgba(255,255,255,0.25); pointer-events: none; }
        .input-wrap input {
          width: 100%; padding: 12px 14px 12px 42px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #E8F0FE;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
        .input-wrap input:focus { border-color: rgba(110,231,183,0.5); background: rgba(255,255,255,0.09); box-shadow: 0 0 0 3px rgba(110,231,183,0.08); }

        .strength-wrap { display: flex; align-items: center; gap: 10px; }
        .strength-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
        .strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
        .strength-weak   { background: #EF4444; }
        .strength-medium { background: #F59E0B; }
        .strength-strong { background: #6EE7B7; }
        .strength-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); min-width: 40px; }

        .btn-primary {
          padding: 14px; background: linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%);
          border: none; border-radius: 12px;
          color: #050A14; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.95rem; cursor: pointer; letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(110,231,183,0.2);
        }
        .btn-primary:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(110,231,183,0.3); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .btn-loading { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(5,10,20,0.3); border-top-color: #050A14; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .terms { font-size: 0.78rem; color: rgba(255,255,255,0.25); text-align: center; line-height: 1.5; }
        .terms a { color: rgba(110,231,183,0.6); text-decoration: none; }
        .terms a:hover { color: #6EE7B7; }

        .auth-switch { margin-top: 20px; text-align: center; font-size: 0.875rem; color: rgba(255,255,255,0.35); }
        .auth-switch a { color: #6EE7B7; text-decoration: none; font-weight: 500; }
        .auth-switch a:hover { opacity: 0.75; }

        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px; margin: 16px; }
          .auth-header h1 { font-size: 1.4rem; }
          .two-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}