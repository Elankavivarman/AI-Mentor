import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export default function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [progress, setProgress] = useState(null);
  const [modules, setModules] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resumeGenerated, setResumeGenerated] = useState(null);
  const [resumeForm, setResumeForm] = useState({
    summary: "",
    skills: "",
    experience: "",
    education: "",
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
    fetchProgress();
    fetchModules();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`${API}/api/progress`, authHeaders());
      setProgress(data);
    } catch {
      /* silent */
    }
  };

  const fetchModules = async () => {
    try {
      const { data } = await axios.get(`${API}/api/modules`, authHeaders());
      setModules(data);
    } catch {
      /* silent */
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setAnalyzing(true);
    setResumeAnalysis(null);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const { data } = await axios.post(`${API}/api/resume/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResumeAnalysis(data);
    } catch (e) {
      setResumeAnalysis({ error: "Analysis failed. Try again." });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateResume = async () => {
    setGenerating(true);
    try {
      const { data } = await axios.post(
        `${API}/api/resume/generate`,
        resumeForm,
        authHeaders()
      );
      setResumeGenerated(data.resume);
    } catch {
      /* silent */
    } finally {
      setGenerating(false);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "modules", label: "Learn", icon: "📚" },
    { id: "resume-check", label: "Resume Check", icon: "🔍" },
    { id: "resume-gen", label: "Resume Builder", icon: "✨" },
    { id: "progress", label: "My Progress", icon: "📈" },
  ];

  const stats = progress
    ? [
        {
          label: "Modules Done",
          value: progress.completedModules ?? 0,
          total: progress.totalModules ?? 10,
          color: "#6EE7B7",
        },
        {
          label: "Exercises",
          value: progress.completedExercises ?? 0,
          total: progress.totalExercises ?? 40,
          color: "#3B82F6",
        },
        {
          label: "Streak",
          value: `${progress.streak ?? 0}d`,
          total: null,
          color: "#F59E0B",
        },
        {
          label: "Score",
          value: `${progress.score ?? 0}%`,
          total: null,
          color: "#8B5CF6",
        },
      ]
    : [];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
            <circle cx="20" cy="20" r="18" stroke="url(#gh)" strokeWidth="2" />
            <path
              d="M12 20 L18 26 L28 14"
              stroke="url(#gh)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="gh"
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
          <span className="brand-text">AI Mentor</span>
        </div>

        <div className="user-chip">
          <div className="avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
          <div className="user-info">
            <span className="user-name">{user.name || "User"}</span>
            <span className="user-role">{user.role || "student"}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activeTab === item.id && <span className="nav-dot" />}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
            <path
              d="M13 7l3 3-3 3M16 10H8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 5H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Sign Out
        </button>
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="main-content">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <span />
            <span />
            <span />
          </button>
          <div className="topbar-title">
            {navItems.find((n) => n.id === activeTab)?.label}
          </div>
          <div className="topbar-right">
            <span className="topbar-greeting">
              Hi, {user.name?.split(" ")[0] || "there"}
            </span>
          </div>
        </header>

        <div className="content-area">
          {/* ── DASHBOARD ── */}
          {activeTab === "dashboard" && (
            <section className="tab-section" key="dashboard">
              <div className="section-head">
                <h2>Your Learning Hub</h2>
                <p>Track your journey to successful career</p>
              </div>
              <div className="stats-grid">
                {stats.map((s, i) => (
                  <div
                    className="stat-card"
                    key={i}
                    style={{ "--accent": s.color }}
                  >
                    <div className="stat-value" style={{ color: s.color }}>
                      {s.value}
                    </div>
                    <div className="stat-label">{s.label}</div>
                    {s.total && (
                      <div className="stat-bar">
                        <div
                          className="stat-fill"
                          style={{
                            width: `${(parseInt(s.value) / s.total) * 100}%`,
                            background: s.color,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="dashboard-grid">
                <div className="dash-card quick-actions">
                  <h3>Quick Start</h3>
                  <div className="action-list">
                    {[
                      {
                        label: "Check My Resume",
                        tab: "resume-check",
                        icon: "🔍",
                        desc: "AI-powered analysis",
                      },
                      {
                        label: "Build Resume",
                        tab: "resume-gen",
                        icon: "✨",
                        desc: "Generate in seconds",
                      },
                      {
                        label: "Start Learning",
                        tab: "modules",
                        icon: "📚",
                        desc: "Structured modules",
                      },
                      {
                        label: "View Progress",
                        tab: "progress",
                        icon: "📈",
                        desc: "Track milestones",
                      },
                    ].map((a) => (
                      <button
                        key={a.tab}
                        className="action-item"
                        onClick={() => setActiveTab(a.tab)}
                      >
                        <span className="action-icon">{a.icon}</span>
                        <div>
                          <div className="action-title">{a.label}</div>
                          <div className="action-desc">{a.desc}</div>
                        </div>
                        <span className="action-arrow">›</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="dash-card recent-modules">
                  <h3>Continue Learning</h3>
                  {modules.slice(0, 3).map((m, i) => (
                    <div className="module-mini" key={i}>
                      <div className="module-mini-icon">
                        {["💡", "🔧", "🚀"][i % 3]}
                      </div>
                      <div className="module-mini-info">
                        <div className="module-mini-title">{m.title}</div>
                        <div className="progress-bar-sm">
                          <div
                            className="progress-fill-sm"
                            style={{ width: `${m.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="module-pct">{m.progress || 0}%</span>
                    </div>
                  ))}
                  {modules.length === 0 && (
                    <p className="empty-state">
                      No modules yet — check the Learn tab!
                    </p>
                  )}
                  <button
                    className="link-btn"
                    onClick={() => setActiveTab("modules")}
                  >
                    View all modules →
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ── MODULES ── */}
          {activeTab === "modules" && (
            <section className="tab-section" key="modules">
              <div className="section-head">
                <h2>Learning Modules</h2>
                <p>Structured paths with live exercises</p>
              </div>
              <div className="modules-grid">
                {modules.length > 0
                  ? modules.map((m, i) => (
                      <div className="module-card" key={i}>
                        <div className="module-icon">
                          {["💡", "🔧", "🚀", "🎯", "🧠"][i % 5]}
                        </div>
                        <div className="module-info">
                          <div className="module-title">{m.title}</div>
                          <div className="module-desc">{m.description}</div>
                          <div className="module-meta">
                            <span className="tag">
                              {m.duration || "30 min"}
                            </span>
                            <span className="tag">{m.level || "Beginner"}</span>
                            <span className="tag">
                              {m.exercises?.length || 0} exercises
                            </span>
                          </div>
                          <div className="module-progress-wrap">
                            <div className="module-progress-bar">
                              <div
                                className="module-progress-fill"
                                style={{ width: `${m.progress || 0}%` }}
                              />
                            </div>
                            <span>{m.progress || 0}%</span>
                          </div>
                        </div>
                        <button
                          className="btn-start"
                          onClick={() =>
                            axios
                              .post(
                                `${API}/api/modules/${m._id}/start`,
                                {},
                                authHeaders()
                              )
                              .catch(() => {})
                          }
                        >
                          {(m.progress || 0) > 0 ? "Continue" : "Start"}
                        </button>
                      </div>
                    ))
                  : /* Skeleton placeholders */
                    [1, 2, 3, 4].map((i) => (
                      <div className="module-card skeleton" key={i}>
                        <div className="skel skel-icon" />
                        <div className="module-info">
                          <div className="skel skel-title" />
                          <div className="skel skel-desc" />
                          <div className="skel skel-bar" />
                        </div>
                      </div>
                    ))}
              </div>
            </section>
          )}

          {/* ── RESUME CHECK ── */}
          {activeTab === "resume-check" && (
            <section className="tab-section" key="resume-check">
              <div className="section-head">
                <h2>AI Resume Checker</h2>
                <p>Get instant feedback to crack any ATS system</p>
              </div>

              <div className="upload-zone">
                <div className="upload-icon">📄</div>
                <p>Drop your resume here or click to browse</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  id="resume-upload"
                  style={{ display: "none" }}
                />
                <label htmlFor="resume-upload" className="upload-label">
                  {resumeFile ? resumeFile.name : "Choose PDF or DOCX"}
                </label>
                <button
                  className="btn-primary"
                  onClick={handleResumeUpload}
                  disabled={!resumeFile || analyzing}
                >
                  {analyzing ? (
                    <>
                      <span className="spinner-dark" /> Analyzing…
                    </>
                  ) : (
                    "Analyze Resume ✦"
                  )}
                </button>
              </div>

              {resumeAnalysis && !resumeAnalysis.error && (
                <div className="analysis-results">
                  <div className="score-ring">
                    <svg viewBox="0 0 100 100" width="120">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#scoreGrad)"
                        strokeWidth="10"
                        strokeDasharray={`${
                          (resumeAnalysis.score / 100) * 251.2
                        } 251.2`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient
                          id="scoreGrad"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#6EE7B7" />
                          <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="score-text">
                      <span className="score-num">{resumeAnalysis.score}</span>
                      <span className="score-label">/ 100</span>
                    </div>
                  </div>

                  <div className="analysis-sections">
                    {resumeAnalysis.strengths?.length > 0 && (
                      <div className="analysis-block strengths">
                        <h4>✅ Strengths</h4>
                        <ul>
                          {resumeAnalysis.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeAnalysis.improvements?.length > 0 && (
                      <div className="analysis-block improvements">
                        <h4>⚡ Improvements</h4>
                        <ul>
                          {resumeAnalysis.improvements.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resumeAnalysis.keywords?.length > 0 && (
                      <div className="analysis-block keywords">
                        <h4>🔑 Missing Keywords</h4>
                        <div className="keyword-chips">
                          {resumeAnalysis.keywords.map((k, i) => (
                            <span className="keyword-chip" key={i}>
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {resumeAnalysis.atsScore !== undefined && (
                      <div className="analysis-block ats">
                        <h4>🤖 ATS Compatibility</h4>
                        <div className="ats-bar">
                          <div
                            className="ats-fill"
                            style={{ width: `${resumeAnalysis.atsScore}%` }}
                          />
                        </div>
                        <span>{resumeAnalysis.atsScore}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {resumeAnalysis?.error && (
                <div className="alert alert-error">{resumeAnalysis.error}</div>
              )}
            </section>
          )}

          {/* ── RESUME GENERATOR ── */}
          {activeTab === "resume-gen" && (
            <section className="tab-section" key="resume-gen">
              <div className="section-head">
                <h2>Resume Generator</h2>
                <p>AI-crafted, ATS-optimized resumes in seconds</p>
              </div>

              <div className="gen-layout">
                <div className="gen-form">
                  {[
                    {
                      key: "summary",
                      label: "Professional Summary",
                      placeholder: "Describe yourself in 2-3 sentences…",
                      rows: 3,
                    },
                    {
                      key: "skills",
                      label: "Skills",
                      placeholder: "React, Node.js, Python, SQL…",
                      rows: 2,
                    },
                    {
                      key: "experience",
                      label: "Work Experience",
                      placeholder: "Company, Role, Duration, Key achievements…",
                      rows: 5,
                    },
                    {
                      key: "education",
                      label: "Education",
                      placeholder: "Degree, University, Year…",
                      rows: 3,
                    },
                  ].map((f) => (
                    <div className="field-group" key={f.key}>
                      <label>{f.label}</label>
                      <textarea
                        rows={f.rows}
                        placeholder={f.placeholder}
                        value={resumeForm[f.key]}
                        onChange={(e) =>
                          setResumeForm({
                            ...resumeForm,
                            [f.key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                  <button
                    className="btn-primary"
                    onClick={handleGenerateResume}
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <span className="spinner-dark" /> Generating…
                      </>
                    ) : (
                      "Generate Resume ✨"
                    )}
                  </button>
                </div>

                {resumeGenerated && (
                  <div className="gen-preview">
                    <h4>Your Generated Resume</h4>
                    <pre className="resume-output">{resumeGenerated}</pre>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        navigator.clipboard.writeText(resumeGenerated)
                      }
                    >
                      Copy to Clipboard
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── PROGRESS ── */}
          {activeTab === "progress" && (
            <section className="tab-section" key="progress">
              <div className="section-head">
                <h2>My Progress</h2>
                <p>Your learning journey at a glance</p>
              </div>

              <div className="progress-grid">
                {progress ? (
                  <>
                    <div className="progress-card">
                      <div className="progress-card-icon">🎓</div>
                      <div className="progress-card-label">
                        Modules Completed
                      </div>
                      <div className="progress-card-value">
                        {progress.completedModules ?? 0} /{" "}
                        {progress.totalModules ?? 10}
                      </div>
                      <div className="progress-bar-lg">
                        <div
                          className="progress-fill-lg"
                          style={{
                            width: `${
                              ((progress.completedModules ?? 0) /
                                (progress.totalModules ?? 10)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="progress-card">
                      <div className="progress-card-icon">🏋️</div>
                      <div className="progress-card-label">Exercises Done</div>
                      <div className="progress-card-value">
                        {progress.completedExercises ?? 0} /{" "}
                        {progress.totalExercises ?? 40}
                      </div>
                      <div className="progress-bar-lg">
                        <div
                          className="progress-fill-lg blue"
                          style={{
                            width: `${
                              ((progress.completedExercises ?? 0) /
                                (progress.totalExercises ?? 40)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="progress-card">
                      <div className="progress-card-icon">🔥</div>
                      <div className="progress-card-label">Day Streak</div>
                      <div className="progress-card-value streak">
                        {progress.streak ?? 0} days
                      </div>
                    </div>
                    <div className="progress-card">
                      <div className="progress-card-icon">⭐</div>
                      <div className="progress-card-label">Overall Score</div>
                      <div className="progress-card-value">
                        {progress.score ?? 0}%
                      </div>
                    </div>

                    {progress.moduleProgress?.length > 0 && (
                      <div className="progress-card full-width">
                        <h4>Module Breakdown</h4>
                        {progress.moduleProgress.map((m, i) => (
                          <div className="module-row" key={i}>
                            <span className="module-row-title">{m.title}</span>
                            <div className="progress-bar-sm">
                              <div
                                className="progress-fill-sm"
                                style={{ width: `${m.percent}%` }}
                              />
                            </div>
                            <span className="module-pct">{m.percent}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="loading-state">Loading your progress…</div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .app-shell {
          display: flex; min-height: 100vh;
          background: #050A14;
          font-family: 'DM Sans', sans-serif;
          color: #E8F0FE;
        }

        /* ─── SIDEBAR ─── */
        .sidebar {
          width: 240px; flex-shrink: 0;
          background: rgba(255,255,255,0.03);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex; flex-direction: column;
          padding: 24px 16px;
          position: fixed; top: 0; left: 0; height: 100vh;
          z-index: 100; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .sidebar-brand {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 28px; padding: 0 8px;
        }
        .brand-text {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: 1.15rem; letter-spacing: -0.03em;
          background: linear-gradient(135deg,#6EE7B7,#3B82F6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .user-chip {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 10px 12px;
          margin-bottom: 20px;
        }
        .avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg,#6EE7B7,#3B82F6);
          color: #050A14; font-weight: 700; font-size: 0.875rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .user-name { display: block; font-size: 0.85rem; font-weight: 500; color: #E8F0FE; }
        .user-role { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.35); text-transform: capitalize; }

        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .nav-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px;
          background: none; border: none; border-radius: 10px;
          color: rgba(255,255,255,0.45); cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          transition: all 0.2s; text-align: left; position: relative;
        }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.75); }
        .nav-item.active { background: rgba(110,231,183,0.1); color: #6EE7B7; }
        .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
        .nav-dot { position: absolute; right: 10px; width: 6px; height: 6px; border-radius: 50%; background: #6EE7B7; }

        .logout-btn {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          cursor: pointer; padding: 10px 12px; border-radius: 10px;
          transition: all 0.2s; margin-top: auto;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); color: #FCA5A5; }

        /* ─── MAIN ─── */
        .main-content { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

        .topbar {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 28px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky; top: 0; z-index: 10;
          backdrop-filter: blur(12px);
        }
        .menu-btn { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 4px; }
        .menu-btn span { display: block; width: 20px; height: 2px; background: rgba(255,255,255,0.6); border-radius: 1px; }
        .topbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; color: #E8F0FE; }
        .topbar-right { margin-left: auto; }
        .topbar-greeting { font-size: 0.875rem; color: rgba(255,255,255,0.45); }

        .content-area { flex: 1; padding: 28px; max-width: 960px; width: 100%; }

        /* ─── SECTIONS ─── */
        .tab-section { animation: fadeIn 0.35s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .section-head { margin-bottom: 24px; }
        .section-head h2 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.5rem; color: #F0F6FF; letter-spacing: -0.03em; }
        .section-head p { margin-top: 4px; font-size: 0.875rem; color: rgba(255,255,255,0.4); }

        /* ─── STATS ─── */
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
        .stat-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 20px;
        }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 800; letter-spacing: -0.04em; }
        .stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.4); margin-top: 2px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
        .stat-fill { height: 100%; border-radius: 2px; }

        /* ─── DASHBOARD GRID ─── */
        .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .dash-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 24px;
        }
        .dash-card h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; margin-bottom: 16px; color: #E8F0FE; }

        .action-list { display: flex; flex-direction: column; gap: 10px; }
        .action-item {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 12px;
          cursor: pointer; transition: all 0.2s; text-align: left; color: inherit; font-family: inherit;
        }
        .action-item:hover { background: rgba(255,255,255,0.08); border-color: rgba(110,231,183,0.25); }
        .action-icon { font-size: 1.25rem; }
        .action-title { font-size: 0.875rem; font-weight: 500; color: #E8F0FE; }
        .action-desc { font-size: 0.75rem; color: rgba(255,255,255,0.35); margin-top: 1px; }
        .action-arrow { margin-left: auto; color: rgba(255,255,255,0.2); font-size: 1.2rem; }

        .module-mini { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .module-mini:last-of-type { border-bottom: none; }
        .module-mini-icon { font-size: 1.2rem; }
        .module-mini-info { flex: 1; }
        .module-mini-title { font-size: 0.85rem; color: #E8F0FE; margin-bottom: 6px; }
        .progress-bar-sm { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
        .progress-fill-sm { height: 100%; background: linear-gradient(90deg,#6EE7B7,#3B82F6); border-radius: 2px; }
        .module-pct { font-size: 0.75rem; color: rgba(255,255,255,0.35); min-width: 32px; text-align: right; }
        .empty-state { font-size: 0.85rem; color: rgba(255,255,255,0.3); padding: 12px 0; }
        .link-btn { background: none; border: none; color: #6EE7B7; font-size: 0.8rem; cursor: pointer; padding: 8px 0 0; font-family: inherit; }

        /* ─── MODULES ─── */
        .modules-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
        .module-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 20px;
          display: flex; gap: 14px; transition: border-color 0.2s;
        }
        .module-card:hover { border-color: rgba(110,231,183,0.25); }
        .module-icon { font-size: 1.8rem; flex-shrink: 0; }
        .module-info { flex: 1; }
        .module-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.95rem; margin-bottom: 6px; }
        .module-desc { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 10px; line-height: 1.5; }
        .module-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
        .tag { font-size: 0.7rem; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 2px 8px; color: rgba(255,255,255,0.5); }
        .module-progress-wrap { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: rgba(255,255,255,0.35); }
        .module-progress-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
        .module-progress-fill { height: 100%; background: linear-gradient(90deg,#6EE7B7,#3B82F6); border-radius: 2px; }
        .btn-start {
          align-self: center; padding: 8px 16px; background: rgba(110,231,183,0.12);
          border: 1px solid rgba(110,231,183,0.3); border-radius: 10px;
          color: #6EE7B7; font-size: 0.8rem; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: all 0.2s;
        }
        .btn-start:hover { background: rgba(110,231,183,0.2); }

        /* Skeleton */
        .skeleton { opacity: 0.4; pointer-events: none; }
        .skel { background: rgba(255,255,255,0.08); border-radius: 6px; animation: shimmer 1.4s ease infinite alternate; }
        .skel-icon { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; }
        .skel-title { height: 14px; width: 70%; margin-bottom: 8px; }
        .skel-desc { height: 10px; width: 90%; margin-bottom: 12px; }
        .skel-bar { height: 4px; width: 100%; }
        @keyframes shimmer { from { opacity: 0.5; } to { opacity: 1; } }

        /* ─── RESUME CHECK ─── */
        .upload-zone {
          background: rgba(255,255,255,0.03); border: 2px dashed rgba(255,255,255,0.12);
          border-radius: 20px; padding: 48px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          margin-bottom: 28px;
        }
        .upload-icon { font-size: 3rem; }
        .upload-zone p { font-size: 0.9rem; color: rgba(255,255,255,0.4); }
        .upload-label {
          padding: 8px 20px; background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 10px;
          font-size: 0.85rem; cursor: pointer; color: rgba(255,255,255,0.7);
          transition: all 0.2s; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .upload-label:hover { background: rgba(255,255,255,0.12); }

        .analysis-results { display: flex; gap: 24px; flex-wrap: wrap; }
        .score-ring { position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .score-text { position: absolute; text-align: center; }
        .score-num { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800; color: #6EE7B7; display: block; }
        .score-label { font-size: 0.7rem; color: rgba(255,255,255,0.35); }
        .analysis-sections { flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .analysis-block {
          background: rgba(255,255,255,0.04); border-radius: 14px; padding: 16px;
          border-left: 3px solid;
        }
        .strengths { border-color: #6EE7B7; }
        .improvements { border-color: #F59E0B; }
        .keywords { border-color: #3B82F6; }
        .ats { border-color: #8B5CF6; }
        .analysis-block h4 { font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; color: #E8F0FE; }
        .analysis-block ul { padding-left: 16px; }
        .analysis-block li { font-size: 0.85rem; color: rgba(255,255,255,0.65); margin-bottom: 4px; }
        .keyword-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .keyword-chip { font-size: 0.75rem; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); border-radius: 6px; padding: 3px 10px; color: #93C5FD; }
        .ats-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; margin: 8px 0 4px; }
        .ats-fill { height: 100%; background: linear-gradient(90deg,#8B5CF6,#3B82F6); border-radius: 3px; }

        /* ─── RESUME GEN ─── */
        .gen-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .gen-form { display: flex; flex-direction: column; gap: 16px; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-group label { font-size: 0.78rem; font-weight: 500; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.06em; }
        .field-group textarea {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #E8F0FE; font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; padding: 12px; outline: none; resize: vertical;
          transition: border-color 0.2s;
        }
        .field-group textarea:focus { border-color: rgba(110,231,183,0.5); }
        .field-group textarea::placeholder { color: rgba(255,255,255,0.2); }
        .gen-preview { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 24px; }
        .gen-preview h4 { font-family: 'Syne', sans-serif; font-weight: 700; margin-bottom: 16px; color: #6EE7B7; }
        .resume-output { white-space: pre-wrap; font-size: 0.8rem; color: rgba(255,255,255,0.7); line-height: 1.7; max-height: 500px; overflow-y: auto; margin-bottom: 16px; }

        /* ─── PROGRESS ─── */
        .progress-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
        .progress-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px; padding: 24px; text-align: center;
        }
        .progress-card.full-width { grid-column: 1/-1; text-align: left; }
        .progress-card h4 { font-family: 'Syne', sans-serif; font-weight: 700; margin-bottom: 16px; color: #E8F0FE; }
        .progress-card-icon { font-size: 2rem; margin-bottom: 10px; }
        .progress-card-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255,255,255,0.4); margin-bottom: 6px; }
        .progress-card-value { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: #F0F6FF; margin-bottom: 12px; }
        .progress-card-value.streak { color: #F59E0B; }
        .progress-bar-lg { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
        .progress-fill-lg { height: 100%; background: linear-gradient(90deg,#6EE7B7,#3B82F6); border-radius: 3px; }
        .progress-fill-lg.blue { background: linear-gradient(90deg,#3B82F6,#8B5CF6); }
        .module-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
        .module-row-title { font-size: 0.85rem; min-width: 140px; color: rgba(255,255,255,0.65); }
        .loading-state { color: rgba(255,255,255,0.3); font-size: 0.9rem; padding: 40px; text-align: center; grid-column: 1/-1; }

        /* ─── SHARED BUTTONS ─── */
        .btn-primary {
          padding: 13px 24px; background: linear-gradient(135deg,#6EE7B7,#3B82F6);
          border: none; border-radius: 12px;
          color: #050A14; font-family: 'Syne', sans-serif; font-weight: 700;
          font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn-secondary {
          padding: 10px 20px; background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 10px;
          color: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.12); }

        .spinner-dark { width: 15px; height: 15px; border: 2px solid rgba(5,10,20,0.3); border-top-color: #050A14; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .alert { padding: 12px 16px; border-radius: 10px; font-size: 0.875rem; margin-top: 16px; }
        .alert-error { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); color: #FCA5A5; }

        /* ─── RESPONSIVE ─── */
        .sidebar-overlay { display: none; }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; }
          .main-content { margin-left: 0; }
          .menu-btn { display: flex; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .dashboard-grid { grid-template-columns: 1fr; }
          .modules-grid { grid-template-columns: 1fr; }
          .gen-layout { grid-template-columns: 1fr; }
          .progress-grid { grid-template-columns: 1fr; }
          .content-area { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
}