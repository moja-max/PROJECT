import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-name">HeritageCare</div>
        <div className="brand-sub">Condition Monitoring System</div>
      </div>

      <nav>
        <div className="nav-section">
          <div className="nav-label">Overview</div>
          <div
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <span className="nav-icon">📊</span> Dashboard
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Heritage</div>
          <div
            className={`nav-item ${activeView === 'buildings' ? 'active' : ''}`}
            onClick={() => setActiveView('buildings')}
          >
            <span className="nav-icon">🏛️</span> Buildings
          </div>
          <div
            className={`nav-item ${activeView === 'inspect' ? 'active' : ''}`}
            onClick={() => setActiveView('inspect')}
          >
            <span className="nav-icon">📋</span> New Inspection
          </div>
          <div
            className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            <span className="nav-icon">📈</span> Condition History
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Maintenance</div>
          <div
            className={`nav-item ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            <span className="nav-icon">🔧</span> Task Board
          </div>
          <div
            className={`nav-item ${activeView === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveView('alerts')}
          >
            <span className="nav-icon">🔔</span> Alerts
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-label">Reports</div>
          <div
            className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveView('reports')}
          >
            <span className="nav-icon">📄</span> Reports
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="nav-section">
            <div className="nav-label">Admin</div>
            <div
              className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
              onClick={() => setActiveView('users')}
            >
              <span className="nav-icon">👤</span> Users
            </div>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">{user?.fullName?.substring(0, 2).toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
