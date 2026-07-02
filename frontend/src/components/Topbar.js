import React from 'react';
import './Topbar.css';

const Topbar = ({ pageTitle }) => {
  return (
    <div className="topbar">
      <div className="page-title">{pageTitle}</div>
      <div className="topbar-actions">
        <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
          Dar es Salaam Antiquities Dept.
        </span>
      </div>
    </div>
  );
};

export default Topbar;
