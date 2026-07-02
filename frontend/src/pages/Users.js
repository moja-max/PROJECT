import React, { useEffect, useState } from 'react';
import { authAPI } from '../utils/api';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'viewer',
  department: 'Dar es Salaam Antiquities Dept.',
  phone: '',
  isActive: true,
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setMessage({ type: 'error', text: 'Unable to load users.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await authAPI.updateUser(editingId, form);
        setMessage({ type: 'success', text: 'User updated successfully.' });
      } else {
        await authAPI.createUser(form);
        setMessage({ type: 'success', text: 'User created successfully.' });
      }
      setForm(initialForm);
      setEditingId(null);
      await fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Unable to save user.' });
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '',
      role: user.role || 'viewer',
      department: user.department || 'Dar es Salaam Antiquities Dept.',
      phone: user.phone || '',
      isActive: user.isActive !== false,
    });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await authAPI.deleteUser(userId);
      setMessage({ type: 'success', text: 'User deleted successfully.' });
      await fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Unable to delete user.' });
    }
  };

  if (loading) return <div className="content"><p>Loading...</p></div>;

  return (
    <div className="content">
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">{editingId ? 'Edit User' : 'Create User'}</div>
          </div>
          <div className="card-body">
            {message && <div className={`alert-banner ${message.type === 'error' ? 'alert-critical' : 'alert-info'}`} style={{ marginBottom: '12px' }}>{message.text}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingId ? 'Leave blank to keep current password' : ''} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="inspector">Inspector</option>
                  <option value="officer">Maintenance Officer</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-control" value={form.isActive ? 'active' : 'inactive'} onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit">{editingId ? 'Update User' : 'Create User'}</button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">System Users</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <strong>{user.fullName}</strong>
                      <br />
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{user.email}</span>
                    </td>
                    <td>{user.role}</td>
                    <td><span className={`badge ${user.isActive === false ? 'badge-poor' : 'badge-good'}`}>{user.isActive === false ? 'Inactive' : 'Active'}</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(user)}>Edit</button>{' '}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
