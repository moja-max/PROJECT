import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';
import ScoreBar from '../components/ScoreBar';
import './Dashboard.css';

const HeritageIcon = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ width: 24, height: 24, flexShrink: 0 }} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 20h16" />
    <path d="M7 20V8l5-3 5 3v12" />
    <path d="M9 20v-4h6v4" />
    <path d="M10 12h4" />
  </svg>
);

const AlertIcon = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ width: 20, height: 20, flexShrink: 0 }} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3 3 19h18L12 3Z" />
    <path d="M12 8v5" />
    <circle cx="12" cy="16" r="1" />
  </svg>
);

const ToolIcon = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ width: 22, height: 22, flexShrink: 0 }} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m14 6 4-4 4 4-4 4" />
    <path d="M14 6 4 16" />
    <path d="m6 18-4 4" />
  </svg>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.dashboard);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content"><p>Loading...</p></div>;

  const { totalBuildings, criticalBuildings, openTasks, overdueTasks, recentInspections, activeAlerts } = stats;

  return (
    <div className="content dashboard-shell">
      <div className="dashboard-hero">
        <div className="dashboard-hero-glow" />
        <div className="dashboard-hero-content">
          <div className="hero-badge">
            <HeritageIcon className="hero-badge-icon" color="#f8f8f2" />
            Antiquities Department
          </div>
          <h2>Protecting heritage with live oversight</h2>
          <p>Monitor building condition, inspections, maintenance, and alerts from one elegant command view.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Buildings</div>
          <div className="stat-value">{totalBuildings}</div>
          <div className="stat-sub">Registered heritage sites</div>
          <div className="stat-icon"><HeritageIcon color="currentColor" /></div>
        </div>
        <div className="stat-card critical">
          <div className="stat-label">Critical Condition</div>
          <div className="stat-value" style={{ color: 'var(--red)' }}>{criticalBuildings}</div>
          <div className="stat-sub">Score below 2.0</div>
          <div className="stat-icon"><AlertIcon color="currentColor" /></div>
        </div>
        <div className="stat-card good">
          <div className="stat-label">Open Tasks</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{openTasks}</div>
          <div className="stat-sub">{overdueTasks} overdue</div>
          <div className="stat-icon"><ToolIcon color="currentColor" /></div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Inspections</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentInspections?.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Building</th>
                    <th>Score</th>
                    <th>Inspector</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInspections.map((insp) => (
                    <tr key={insp._id}>
                      <td><strong>{insp.building?.name}</strong></td>
                      <td><ScoreBar score={insp.compositeScore} /></td>
                      <td>{insp.inspector?.fullName}</td>
                      <td>{new Date(insp.inspectionDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>No recent inspections</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Active Alerts</div>
          </div>
          <div className="card-body">
            {activeAlerts?.length > 0 ? (
              activeAlerts.map((alert) => (
                <div key={alert._id} className={`alert-banner alert-${alert.severity}`} style={{ marginBottom: '10px' }}>
                  <span><AlertIcon color="currentColor" /></span>
                  <div>
                    <strong>{alert.building?.name}</strong>
                    <br />
                    <span style={{ fontSize: '12px' }}>{alert.message}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--muted)', textAlign: 'center' }}>No active alerts</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
