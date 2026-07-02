import React, { useState, useEffect } from 'react';
import { alertAPI } from '../utils/api';

const Alerts = ({ onNavigateToTasks }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await alertAPI.getAll({ isResolved: false });
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content"><p>Loading...</p></div>;

  const handleMaintain = (building) => {
    if (onNavigateToTasks) {
      onNavigateToTasks(building);
    }
  };

  return (
    <div className="content">
      <div className="alert-banner alert-critical">
        <span>🚨</span>
        <div><strong>{alerts.filter(a => a.severity === 'critical').length} buildings are in critical condition</strong></div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Active Alerts</div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {alerts.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Building</th>
                  <th>Score</th>
                  <th>Triggered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert._id}>
                    <td><span className={`badge badge-${alert.severity}`}>● {alert.severity}</span></td>
                    <td><strong>{alert.building?.name}</strong></td>
                    <td><strong style={{ color: 'var(--red)' }}>{alert.score?.toFixed(1)} / 5.0</strong></td>
                    <td>{new Date(alert.triggeredAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleMaintain(alert.building)}>
                        Maintain
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>No active alerts</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
