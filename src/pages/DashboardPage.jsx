import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getDashboardSummaryApi } from "../api/dashboardApi";

function StatCard({ label, value }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #e5e7eb", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDashboardSummaryApi();
        setSummary(res.data?.data || null);
      } catch (error) {
        console.error('Fetch dashboard summary failed:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout title="Dashboard">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Tổng quan công việc</h2>
        <p style={{ color: '#6b7280' }}>Xem nhanh số lượng project và task trong các project bạn đang tham gia.</p>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <StatCard label="Total Projects" value={summary?.totalProjects || 0} />
          <StatCard label="Total Tasks" value={summary?.totalTasks || 0} />
          <StatCard label="TODO" value={summary?.todoTasks || 0} />
          <StatCard label="IN PROGRESS" value={summary?.inProgressTasks || 0} />
          <StatCard label="DONE" value={summary?.doneTasks || 0} />
        </div>
      )}
    </Layout>
  );
}
