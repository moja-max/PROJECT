import React, { useState, useEffect } from 'react';
import { buildingAPI } from '../utils/api';
import ScoreBar from '../components/ScoreBar';

const initialFormState = {
  registrationNumber: '',
  name: '',
  location: '',
  description: '',
  historicalStyle: 'Other',
  yearBuilt: '',
  latitude: '',
  longitude: '',
  images: '',
  compositeScore: '3',
  status: 'fair',
};

const normalizeRegistrationNumber = (value) => {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (!cleaned) return '';

  const digits = cleaned.match(/\d{0,3}$/)?.[0] || '';
  if (!digits) {
    return cleaned.startsWith('DSMHB') ? 'DSM-HB-' : cleaned;
  }

  return `DSM-HB-${digits.padStart(3, '0')}`;
};

const Buildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewingBuilding, setViewingBuilding] = useState(null);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await buildingAPI.getAll({ search: searchInput.trim() });
      setBuildings(response.data.buildings || []);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
      setMessage({ type: 'error', text: 'Unable to load buildings right now.' });
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingBuilding(null);
    setFormData(initialFormState);
    setShowForm(true);
    setMessage(null);
  };

  const openViewModal = (building) => {
    setViewingBuilding(building);
    setEditingBuilding(null);
    setFormData(initialFormState);
    setShowForm(false);
    setMessage(null);
  };

  const openEditForm = (building) => {
    setViewingBuilding(null);
    setEditingBuilding(building);
    setFormData({
      registrationNumber: building.registrationNumber || '',
      name: building.name || '',
      location: building.location || '',
      description: building.description || '',
      historicalStyle: building.historicalStyle || 'Other',
      yearBuilt: building.yearBuilt || '',
      latitude: building.coordinates?.latitude ?? '',
      longitude: building.coordinates?.longitude ?? '',
      images: (building.images || []).join(', '),
      compositeScore: building.compositeScore?.toString() || '3',
      status: building.status || 'fair',
    });
    setShowForm(true);
    setMessage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const normalizedValue = name === 'registrationNumber' ? normalizeRegistrationNumber(value) : value;
    setFormData((prev) => ({ ...prev, [name]: normalizedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        registrationNumber: formData.registrationNumber.trim(),
        name: formData.name.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        historicalStyle: formData.historicalStyle,
        yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : undefined,
        compositeScore: Number(formData.compositeScore) || 3,
        status: formData.status,
        images: formData.images
          .split(/,|\n/)
          .map((item) => item.trim())
          .filter(Boolean),
        coordinates: {},
      };

      if (formData.latitude !== '') payload.coordinates.latitude = Number(formData.latitude);
      if (formData.longitude !== '') payload.coordinates.longitude = Number(formData.longitude);

      if (!Object.keys(payload.coordinates).length) {
        delete payload.coordinates;
      }

      if (editingBuilding) {
        await buildingAPI.update(editingBuilding._id, payload);
        setMessage({ type: 'success', text: 'Building updated successfully.' });
      } else {
        await buildingAPI.create(payload);
        setMessage({ type: 'success', text: 'Building added successfully.' });
      }

      setShowForm(false);
      setFormData(initialFormState);
      await fetchBuildings();
    } catch (error) {
      console.error('Failed to save building:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Could not save the building.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this heritage place?')) return;

    try {
      await buildingAPI.delete(id);
      setMessage({ type: 'success', text: 'Building deleted.' });
      await fetchBuildings();
    } catch (error) {
      console.error('Failed to delete building:', error);
      setMessage({ type: 'error', text: 'Delete failed.' });
    }
  };

  if (loading) return <div className="content"><p>Loading...</p></div>;

  return (
    <div className="content">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Heritage Building Registry</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              className="form-control"
              style={{ width: '220px' }}
              placeholder="Search by name,location or reg #"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={openCreateForm}>+ Add Building</button>
          </div>
        </div>

        {message && (
          <div style={{ padding: '12px 16px', margin: '12px 16px 0', borderRadius: '8px', background: message.type === 'error' ? '#fde2e2' : '#eaf7ea', color: message.type === 'error' ? '#b42318' : '#067647' }}>
            {message.text}
          </div>
        )}

        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Reg #</th>
                <th>Place</th>
                <th>Photo</th>
                <th>Coordinates</th>
                <th>Score</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buildings.map((building) => (
                <tr key={building._id}>
                  <td style={{ fontSize: '12px', color: 'var(--muted)' }}>{building.registrationNumber}</td>
                  <td>
                    <strong>{building.name}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>{building.location}</div>
                  </td>
                  <td>
                    {building.images?.length ? (
                      <img src={building.images[0]} alt={building.name} style={{ width: '72px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <span style={{ color: 'var(--muted)' }}>No photo</span>
                    )}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {building.coordinates?.latitude !== undefined && building.coordinates?.longitude !== undefined
                      ? `${building.coordinates.latitude}, ${building.coordinates.longitude}`
                      : '—'}
                  </td>
                  <td><ScoreBar score={building.compositeScore} /></td>
                  <td><span className={`badge badge-${building.status}`}>● {building.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => openViewModal(building)}>View</button>
                      <button className="btn btn-sm btn-outline" onClick={() => openEditForm(building)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(building._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showForm || viewingBuilding) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '760px', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{viewingBuilding ? 'View Heritage Place' : editingBuilding ? 'Edit Heritage Place' : 'Add Heritage Place'}</h3>
              <button className="btn btn-sm btn-outline" onClick={() => { setShowForm(false); setViewingBuilding(null); }}>Close</button>
            </div>

            {viewingBuilding ? (
              <div>
                <p><strong>Registration Number:</strong> {viewingBuilding.registrationNumber}</p>
                <p><strong>Name:</strong> {viewingBuilding.name}</p>
                <p><strong>Location:</strong> {viewingBuilding.location}</p>
                <p><strong>Historical Style:</strong> {viewingBuilding.historicalStyle}</p>
                <p><strong>Year Built:</strong> {viewingBuilding.yearBuilt || 'N/A'}</p>
                <p><strong>Status:</strong> {viewingBuilding.status}</p>
                <p><strong>Coordinates:</strong> {viewingBuilding.coordinates?.latitude !== undefined && viewingBuilding.coordinates?.longitude !== undefined ? `${viewingBuilding.coordinates.latitude}, ${viewingBuilding.coordinates.longitude}` : 'N/A'}</p>
                <p><strong>Description:</strong> {viewingBuilding.description || 'N/A'}</p>
                <p><strong>Photo URLs:</strong></p>
                {viewingBuilding.images?.length ? (
                  <ul style={{ marginLeft: '20px' }}>
                    {viewingBuilding.images.map((url, idx) => (
                      <li key={idx}><a href={url} target="_blank" rel="noreferrer">Image {idx + 1}</a></li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--muted)' }}>No images available</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                <div>
                  <label>Registration Number</label>
                  <input className="form-control" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="DSM-HB-123" required />
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Format required: DSM-HB-123</div>
                </div>
                <div>
                  <label>Building Name</label>
                  <input className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Location</label>
                  <input className="form-control" name="location" value={formData.location} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Historical Style</label>
                  <select className="form-control" name="historicalStyle" value={formData.historicalStyle} onChange={handleInputChange}>
                    <option>Colonial Gothic</option>
                    <option>Neo-Classical</option>
                    <option>Gothic Revival</option>
                    <option>Swahili-German</option>
                    <option>Indo-Islamic</option>
                    <option>Colonial</option>
                    <option>Modernist</option>
                    <option>Romanesque</option>
                    <option>British Colonial</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label>Year Built</label>
                  <input className="form-control" type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Condition Status</label>
                  <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="critical">Critical</option>
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label>Latitude</label>
                  <input className="form-control" type="number" step="any" name="latitude" value={formData.latitude} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Longitude</label>
                  <input className="form-control" type="number" step="any" name="longitude" value={formData.longitude} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Condition Score</label>
                  <input className="form-control" type="number" min="1" max="5" name="compositeScore" value={formData.compositeScore} onChange={handleInputChange} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Photo URLs</label>
                  <textarea className="form-control" name="images" rows="3" value={formData.images} onChange={handleInputChange} placeholder="Paste one or more image URLs, separated by commas or new lines" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Add notes about the heritage place" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editingBuilding ? 'Update Building' : 'Save Building'}</button>
              </div>
            </form>
          )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Buildings;
