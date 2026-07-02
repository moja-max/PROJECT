import React, { useState, useContext, useEffect } from 'react';
import { inspectionAPI, buildingAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { calculateCompositeScore } from '../utils/helpers';

const Inspection = ({ onSuccess, initialBuilding, onAlertsUpdated }) => {
  const { user } = useContext(AuthContext);
  const [building, setBuilding] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [ratings, setRatings] = useState({});
  const [compositeScore, setCompositeScore] = useState(0);
  const [weatherConditions, setWeatherConditions] = useState('Clear / Dry');
  const [generalNotes, setGeneralNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const elements = [
    { key: 'roof', label: 'Roof', weight: 0.2, icon: '' },
    { key: 'walls', label: 'Walls & Facade', weight: 0.2, icon: '' },
    { key: 'windows', label: 'Windows & Doors', weight: 0.15, icon: '' },
    { key: 'foundation', label: 'Foundations', weight: 0.25, icon: '' },
    { key: 'interior', label: 'Interior Structural', weight: 0.1, icon: '' },
    { key: 'services', label: 'Services & Utilities', weight: 0.1, icon: '' },
  ];

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (initialBuilding?._id) {
      setBuilding(initialBuilding._id);
    }
  }, [initialBuilding]);

  const fetchBuildings = async () => {
    try {
      const response = await buildingAPI.getAll();
      setBuildings(response.data.buildings);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    }
  };

  const handleRatingChange = (key, value) => {
    const newRatings = { ...ratings, [key]: value };
    setRatings(newRatings);
    const score = calculateCompositeScore(newRatings);
    setCompositeScore(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!building) {
      setMessage({ type: 'error', text: 'Please select a building before submitting.' });
      return;
    }

    if (Object.keys(ratings).length < elements.length) {
      setMessage({ type: 'error', text: 'Please rate every condition element before submitting.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await inspectionAPI.submit({
        building,
        elementRatings: ratings,
        weatherConditions,
        generalNotes,
      });
      setMessage({ type: 'success', text: 'Inspection submitted successfully.' });
      setRatings({});
      setCompositeScore(0);
      setWeatherConditions('Clear / Dry');
      setGeneralNotes('');
      setBuilding('');
      if (onAlertsUpdated) onAlertsUpdated();
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit inspection.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="alert-banner alert-info">
        
        <span>Rate each building element from 1 (Critical) to 5 (Excellent). All elements are required.</span>
      </div>

      {initialBuilding?.name && (
        <div className="alert-banner alert-info" style={{ marginBottom: '12px' }}>
          <span>📍</span>
          <span>Inspection started for {initialBuilding.name}</span>
        </div>
      )}

      {message && (
        <div style={{ padding: '12px 14px', marginBottom: '12px', borderRadius: '8px', background: message.type === 'error' ? '#fde2e2' : '#eaf7ea', color: message.type === 'error' ? '#b42318' : '#067647' }}>
          {message.text}
        </div>
      )}

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Inspection Details</div>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Building</label>
              <select className="form-control" value={building} onChange={(e) => setBuilding(e.target.value)}>
                <option value="">Select a building…</option>
                {buildings.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Inspector</label>
              <input className="form-control" value={user?.fullName} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Weather Conditions</label>
              <select className="form-control" value={weatherConditions} onChange={(e) => setWeatherConditions(e.target.value)}>
                <option value="Clear / Dry">Clear / Dry</option>
                <option value="Overcast">Overcast</option>
                <option value="Wet / Rainy">Wet / Rainy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">General Notes</label>
              <textarea className="form-control" rows="3" placeholder="Overall observations…" value={generalNotes} onChange={(e) => setGeneralNotes(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Composite Score Preview</div>
          </div>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--teal)' }}>
              {compositeScore.toFixed(1)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>/ 5.0</div>
            {compositeScore > 0 && compositeScore < 2.5 && (
              <div className="alert-banner alert-critical" style={{ marginTop: '16px' }}>
                ⚠️ Score below threshold - alert will be triggered
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Element Condition Ratings</div>
        </div>
        <div className="card-body">
          {elements.map((el) => (
            <div key={el.key} style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '600', color: 'var(--dark)' }}>
                  {el.icon} {el.label}
                </span>
                <span style={{ float: 'right', fontSize: '11px', color: 'var(--muted)' }}>
                  Weight: {(el.weight * 100).toFixed(0)}%
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => handleRatingChange(el.key, v)}
                    style={{
                      width: '36px',
                      height: '36px',
                      border: ratings[el.key] === v ? 'none' : '2px solid var(--border)',
                      background: ratings[el.key] === v ? 'var(--teal)' : 'white',
                      color: ratings[el.key] === v ? 'white' : 'var(--muted)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '700',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
        <button className="btn btn-primary" type="submit" onClick={handleSubmit} disabled={loading || !building || Object.keys(ratings).length < elements.length}>
          {loading ? 'Submitting...' : '✓ Submit Inspection'}
        </button>
      </div>
    </div>
  );
};

export default Inspection;
