import React, { useState, useEffect } from 'react';
import { taskAPI, buildingAPI, inspectionAPI } from '../utils/api';

const initialFormState = {
  title: '',
  building: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  estimatedCost: '',
  notes: '',
};

const Tasks = ({ onInspectBuilding, onAlertsUpdated }) => {
  const [tasks, setTasks] = useState({ pending: [], inProgress: [], completed: [] });
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [inspectionForm, setInspectionForm] = useState({ weatherConditions: 'Clear / Dry', generalNotes: '', elementRatings: {} });
  const [message, setMessage] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchBuildings();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAll();
      const grouped = { pending: [], inProgress: [], completed: [] };
      response.data.tasks.forEach((task) => {
        if (task.status === 'pending') grouped.pending.push(task);
        else if (task.status === 'in-progress') grouped.inProgress.push(task);
        else if (task.status === 'completed') grouped.completed.push(task);
      });
      setTasks(grouped);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setMessage({ type: 'error', text: 'Unable to load tasks right now.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const response = await buildingAPI.getAll();
      setBuildings(response.data.buildings || []);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    }
  };

  const openCreateTask = () => {
    setModalMode('create');
    setSelectedTask(null);
    setFormData(initialFormState);
    setMessage(null);
    setShowModal(true);
  };

  const openEditTask = (task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setFormData({
      title: task.title || '',
      building: task.building?._id || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      estimatedCost: task.estimatedCost || '',
      notes: task.notes || '',
    });
    setMessage(null);
    setShowModal(true);
  };

  const openViewTask = (task) => {
    setModalMode('view');
    setSelectedTask(task);
    setMessage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setFormData(initialFormState);
    setInspectionForm({ weatherConditions: 'Clear / Dry', generalNotes: '', elementRatings: {} });
    setMessage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.building) {
      setMessage({ type: 'error', text: 'Please select a building.' });
      return;
    }
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Task title is required.' });
      return;
    }

    setProcessing(true);
    try {
      const payload = {
        title: formData.title.trim(),
        building: formData.building,
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
        notes: formData.notes.trim(),
      };

      if (modalMode === 'edit' && selectedTask) {
        await taskAPI.update(selectedTask._id, payload);
        setMessage({ type: 'success', text: 'Task updated successfully.' });
      } else {
        await taskAPI.create(payload);
        setMessage({ type: 'success', text: 'Task created successfully.' });
      }

      closeModal();
      await fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Unable to save task.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleStartTask = async (task) => {
    setProcessing(true);
    try {
      await taskAPI.update(task._id, { status: 'in-progress' });
      await fetchTasks();
    } catch (error) {
      console.error('Failed to start task:', error);
      setMessage({ type: 'error', text: 'Unable to move task to In Progress.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCompleteTask = async (task) => {
    setProcessing(true);
    try {
      await taskAPI.complete(task._id, {});
      await fetchTasks();
    } catch (error) {
      console.error('Failed to complete task:', error);
      setMessage({ type: 'error', text: 'Unable to complete task.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setProcessing(true);
    try {
      await taskAPI.delete(taskId);
      await fetchTasks();
      setMessage({ type: 'success', text: 'Task deleted successfully.' });
    } catch (error) {
      console.error('Failed to delete task:', error);
      setMessage({ type: 'error', text: 'Unable to delete task.' });
    } finally {
      setProcessing(false);
    }
  };

  const openInspectionModal = (task) => {
    if (onInspectBuilding && task?.building) {
      onInspectBuilding(task.building);
      return;
    }

    setSelectedTask(task);
    setModalMode('inspection');
    setInspectionForm({ weatherConditions: 'Clear / Dry', generalNotes: '', elementRatings: {} });
    setMessage(null);
    setShowModal(true);
  };

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask?.building?._id) {
      setMessage({ type: 'error', text: 'No building linked to this task.' });
      return;
    }

    const elementRatings = inspectionForm.elementRatings;
    const requiredElements = ['roof', 'walls', 'windows', 'foundation', 'interior', 'services'];
    const missingRatings = requiredElements.filter((key) => elementRatings[key] === undefined);

    if (missingRatings.length) {
      setMessage({ type: 'error', text: 'Please rate every condition element before submitting.' });
      return;
    }

    setProcessing(true);
    try {
      await inspectionAPI.submit({
        building: selectedTask.building._id,
        elementRatings,
        weatherConditions: inspectionForm.weatherConditions,
        generalNotes: inspectionForm.generalNotes || `Follow-up inspection after maintenance task: ${selectedTask.title}`,
      });
      setMessage({ type: 'success', text: 'Follow-up inspection recorded successfully.' });
      closeModal();
      if (onAlertsUpdated) onAlertsUpdated();
      await fetchTasks();
    } catch (error) {
      console.error('Failed to submit follow-up inspection:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Unable to record follow-up inspection.' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="content"><p>Loading...</p></div>;

  const TaskCard = ({ task }) => (
    <div className="task-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <strong>{task.title}</strong>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: '1.4' }}>
        <div>🏛️ {task.building?.name || 'Unknown building'}</div>
        <div>📅 Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
        <div>Priority: {task.priority}</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        <button className="btn btn-sm btn-secondary" onClick={() => openViewTask(task)}>View</button>
        {task.status === 'pending' && <button className="btn btn-sm btn-primary" onClick={() => handleStartTask(task)} disabled={processing}>Start</button>}
        {task.status === 'in-progress' && <button className="btn btn-sm btn-success" onClick={() => handleCompleteTask(task)} disabled={processing}>Complete</button>}
        {task.status === 'completed' && <button className="btn btn-sm btn-primary" onClick={() => openInspectionModal(task)} disabled={processing}>Inspect</button>}
        <button className="btn btn-sm btn-outline" onClick={() => openEditTask(task)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)} disabled={processing}>Delete</button>
      </div>
    </div>
  );

  return (
    <div className="content">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h2>Maintenance Task Board</h2>
        <button className="btn btn-primary" onClick={openCreateTask}>+ New Task</button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', marginBottom: '16px', borderRadius: '8px', background: message.type === 'error' ? '#fde2e2' : '#eaf7ea', color: message.type === 'error' ? '#b42318' : '#067647' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '12px' }}>
            Pending <span style={{ background: 'var(--border)', color: 'var(--text)', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>{tasks.pending.length}</span>
          </h3>
          {tasks.pending.length ? tasks.pending.map((task) => <TaskCard key={task._id} task={task} />) : <p style={{ color: 'var(--muted)' }}>No pending tasks</p>}
        </div>

        <div>
          <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '12px' }}>
            In Progress <span style={{ background: 'var(--border)', color: 'var(--text)', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>{tasks.inProgress.length}</span>
          </h3>
          {tasks.inProgress.length ? tasks.inProgress.map((task) => <TaskCard key={task._id} task={task} />) : <p style={{ color: 'var(--muted)' }}>No tasks in progress</p>}
        </div>

        <div>
          <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '12px' }}>
            Completed <span style={{ background: 'var(--border)', color: 'var(--text)', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>{tasks.completed.length}</span>
          </h3>
          {tasks.completed.length ? tasks.completed.map((task) => <TaskCard key={task._id} task={task} />) : <p style={{ color: 'var(--muted)' }}>No completed tasks</p>}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '700px', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>{modalMode === 'view' ? 'View Task' : modalMode === 'edit' ? 'Edit Task' : 'New Task'}</h3>
              <button className="btn btn-sm btn-outline" onClick={closeModal}>Close</button>
            </div>

            {modalMode === 'view' && selectedTask ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p><strong>Title</strong></p>
                  <p>{selectedTask.title}</p>
                  <p><strong>Building</strong></p>
                  <p>{selectedTask.building?.name || 'N/A'}</p>
                  <p><strong>Status</strong></p>
                  <p>{selectedTask.status}</p>
                  <p><strong>Priority</strong></p>
                  <p>{selectedTask.priority}</p>
                </div>
                <div>
                  <p><strong>Due Date</strong></p>
                  <p>{selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Estimated Cost</strong></p>
                  <p>{selectedTask.estimatedCost ?? 'N/A'}</p>
                  <p><strong>Completed Date</strong></p>
                  <p>{selectedTask.completedDate ? new Date(selectedTask.completedDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Notes</strong></p>
                  <p>{selectedTask.notes || 'N/A'}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p><strong>Description</strong></p>
                  <p style={{ whiteSpace: 'pre-line', color: 'var(--text)' }}>{selectedTask.description || 'N/A'}</p>
                </div>
              </div>
            ) : modalMode === 'inspection' ? (
              <form onSubmit={handleInspectionSubmit}>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label>Building</label>
                    <input className="form-control" value={selectedTask?.building?.name || 'Selected building'} readOnly />
                  </div>
                  <div>
                    <label>Weather Conditions</label>
                    <select className="form-control" value={inspectionForm.weatherConditions} onChange={(e) => setInspectionForm((prev) => ({ ...prev, weatherConditions: e.target.value }))}>
                      <option value="Clear / Dry">Clear / Dry</option>
                      <option value="Overcast">Overcast</option>
                      <option value="Wet / Rainy">Wet / Rainy</option>
                    </select>
                  </div>
                  <div>
                    <label>Condition Ratings</label>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {[
                        { key: 'roof', label: 'Roof' },
                        { key: 'walls', label: 'Walls & Facade' },
                        { key: 'windows', label: 'Windows & Doors' },
                        { key: 'foundation', label: 'Foundation' },
                        { key: 'interior', label: 'Interior' },
                        { key: 'services', label: 'Services & Utilities' },
                      ].map((item) => (
                        <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{item.label}</span>
                          <select
                            className="form-control"
                            style={{ width: '120px' }}
                            value={inspectionForm.elementRatings[item.key] || ''}
                            onChange={(e) => setInspectionForm((prev) => ({
                              ...prev,
                              elementRatings: { ...prev.elementRatings, [item.key]: Number(e.target.value) },
                            }))}
                          >
                            <option value="">Select</option>
                            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label>Inspection Notes</label>
                    <textarea className="form-control" rows="4" value={inspectionForm.generalNotes} onChange={(e) => setInspectionForm((prev) => ({ ...prev, generalNotes: e.target.value }))} placeholder="Add follow-up inspection notes" />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={processing}>{processing ? 'Saving...' : 'Record Inspection'}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label>Task Title</label>
                    <input className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label>Building</label>
                    <select className="form-control" name="building" value={formData.building} onChange={handleInputChange} required>
                      <option value="">Select building</option>
                      {buildings.map((building) => (
                        <option key={building._id} value={building._id}>{building.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Priority</label>
                    <select className="form-control" name="priority" value={formData.priority} onChange={handleInputChange}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label>Due Date</label>
                    <input className="form-control" type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} />
                  </div>
                  <div>
                    <label>Estimated Cost</label>
                    <input className="form-control" type="number" min="0" name="estimatedCost" value={formData.estimatedCost} onChange={handleInputChange} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleInputChange} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Notes</label>
                    <textarea className="form-control" name="notes" rows="3" value={formData.notes} onChange={handleInputChange} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={processing}>{processing ? 'Saving...' : modalMode === 'edit' ? 'Update Task' : 'Create Task'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
