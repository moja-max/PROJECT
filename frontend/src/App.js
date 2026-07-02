import React, { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Buildings from './pages/Buildings';
import Inspection from './pages/Inspection';
import History from './pages/History';
import Tasks from './pages/Tasks';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Users from './pages/Users';
import './App.css';

function App() {
  const { user, token, loading } = useContext(AuthContext);
  const [activeView, setActiveView] = useState('dashboard');
  const [inspectionTarget, setInspectionTarget] = useState(null);

  const handleInspectBuilding = (building) => {
    setInspectionTarget(building);
    setActiveView('inspect');
  };

  const handleMaintainBuilding = (building) => {
    setActiveView('tasks');
  };

  const handleAlertsUpdated = () => {
    // Trigger refresh of alerts when they are resolved
    setActiveView('alerts');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!token) {
    return <Login />;
  }

  const getTitles = {
    dashboard: 'Dashboard',
    buildings: 'Heritage Building Registry',
    inspect: 'New Inspection',
    history: 'Condition History',
    tasks: 'Maintenance Task Board',
    alerts: 'Alerts & Notifications',
    reports: 'Reports',
    users: 'User Management',
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="main">
        <Topbar 
          pageTitle={getTitles[activeView] || 'Dashboard'} 
        />

        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'history' && <History />}
        {activeView === 'tasks' && <Tasks onInspectBuilding={handleInspectBuilding} onAlertsUpdated={handleAlertsUpdated} />}
        {activeView === 'alerts' && <Alerts onNavigateToTasks={handleMaintainBuilding} />}
        {activeView === 'reports' && <Reports />}
        {activeView === 'users' && <Users />}
        {activeView === 'buildings' && <Buildings />}
        {activeView === 'inspect' && <Inspection initialBuilding={inspectionTarget} onSuccess={() => setActiveView('history')} onAlertsUpdated={handleAlertsUpdated} />}
      </main>
    </div>
  );
}

export default App;
