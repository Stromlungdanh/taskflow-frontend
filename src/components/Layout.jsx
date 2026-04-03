import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";

function NavItem({ label, path, icon }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname.startsWith(path);
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        width: "100%", textAlign: "left", padding: "12px 14px", marginBottom: 8, borderRadius: 10, border: "none",
        background: active ? "#1d4ed8" : "transparent", color: "white", cursor: "pointer", fontWeight: 600
      }}
    >
      {icon} {label}
    </button>
  );
}

export default function Layout({ title = "TaskFlow", children }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <div style={{ width: 240, background: "#111827", color: "white", padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>TaskFlow</h2>
        <NavItem label="Dashboard" path="/dashboard" icon="📊" />
        <NavItem label="Projects" path="/projects" icon="📁" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ height: 64, background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <b>{title}</b>
          <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '8px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Logout</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}
