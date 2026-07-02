import React, { useState, useEffect } from 'react';
import { inspectionAPI, buildingAPI } from '../utils/api';
import ScoreBar from '../components/ScoreBar';

const History = () => {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      fetchInspections();
    }
  }, [selectedBuilding]);

  const fetchBuildings = async () => {
    try {
      const response = await buildingAPI.getAll();
      setBuildings(response.data.buildings);
      if (response.data.buildings.length > 0) {
        setSelectedBuilding(response.data.buildings[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInspections = async () => {
    try {
      const response = await inspectionAPI.getByBuilding(selectedBuilding);
      setInspections(response.data.inspections);
    } catch (error) {
      console.error('Failed to fetch inspections:', error);
    }
  };

  if (loading) return <div className="content"><p>Loading...</p></div>;

  return (
    <div className="content">
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title">Building Condition History</div>
          <select
            className="form-control btn-sm"
            style={{ width: '200px' }}
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
          >
            {buildings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="card-body">
          {inspections.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Inspector</th>
                  <th>Weather</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((insp) => (
                  <tr key={insp._id}>
                    <td>{new Date(insp.inspectionDate).toLocaleDateString()}</td>
                    <td><ScoreBar score={insp.compositeScore} /></td>
                    <td>{insp.inspector?.fullName}</td>
                    <td>{insp.weatherConditions}</td>
                    <td style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      {insp.generalNotes?.substring(0, 50)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>No inspection history</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Element Ratings Trend</div>
        </div>
        <div className="card-body">
          {inspections.length > 0 ? (
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
                Latest inspection scores by element:
              </p>
              <div style={{ marginTop: '16px' }}>
                {Object.entries(inspections[0].elementRatings).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}/5
                    </div>
                    <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'var(--teal)',
                          width: `${(value / 5) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--muted)' }}>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
