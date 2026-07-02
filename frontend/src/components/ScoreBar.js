import React from 'react';

const ScoreBar = ({ score, showPercentage = false }) => {
  const percentage = (score / 5) * 100;
  const getColor = (score) => {
    if (score <= 2.0) return '#c0392b';
    if (score <= 2.5) return '#e07030';
    if (score <= 3.0) return '#e8a020';
    if (score <= 4.0) return '#27ae60';
    return '#1565c0';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '3px',
            width: `${percentage}%`,
            background: getColor(score),
            transition: 'width .6s ease',
          }}
        />
      </div>
      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--dark)', minWidth: '28px', textAlign: 'right' }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
};

export default ScoreBar;
