import MaintenanceTask from '../models/MaintenanceTask.js';

export const createTask = async (req, res) => {
  try {
    const { building, title, description, priority, dueDate, assignedTo } = req.body;

    const task = await MaintenanceTask.create({
      building,
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user.id,
      status: 'pending',
    });

    res.status(201).json({ success: true, message: 'Task created', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, building, assignedTo, priority, limit = 50, skip = 0 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (building) query.building = building;
    if (assignedTo) query.assignedTo = assignedTo;
    if (priority) query.priority = priority;

    const tasks = await MaintenanceTask.find(query)
      .populate('building', 'name')
      .populate('assignedTo', 'fullName')
      .populate('createdBy', 'fullName')
      .sort({ dueDate: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await MaintenanceTask.countDocuments(query);

    res.json({ success: true, total, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await MaintenanceTask.findById(req.params.id)
      .populate('building', 'name location')
      .populate('assignedTo', 'fullName email')
      .populate('createdBy', 'fullName');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await MaintenanceTask.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('building', 'name')
      .populate('assignedTo', 'fullName');

    res.json({ success: true, message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { actualCost, notes } = req.body;

    const task = await MaintenanceTask.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedDate: new Date(),
        actualCost,
        notes,
      },
      { new: true }
    );

    res.json({ success: true, message: 'Task completed', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await MaintenanceTask.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const pending = await MaintenanceTask.countDocuments({ status: 'pending' });
    const inProgress = await MaintenanceTask.countDocuments({ status: 'in-progress' });
    const completed = await MaintenanceTask.countDocuments({ status: 'completed' });
    const overdue = await MaintenanceTask.countDocuments({
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() },
    });

    res.json({ success: true, stats: { pending, inProgress, completed, overdue } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
