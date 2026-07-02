import Building from '../models/Building.js';

export const getAllBuildings = async (req, res) => {
  try {
    const { search, status, sortBy } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    let sort = { createdAt: -1 };
    if (sortBy === 'score') sort = { compositeScore: -1 };
    if (sortBy === 'lastInspected') sort = { lastInspected: -1 };

    const buildings = await Building.find(query).sort(sort);
    res.json({ success: true, count: buildings.length, buildings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuildingById = async (req, res) => {
  try {
    const building = await Building.findById(req.params.id).populate('scoreHistory.inspector', 'fullName');
    if (!building) {
      return res.status(404).json({ message: 'Building not found' });
    }
    res.json({ success: true, building });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBuilding = async (req, res) => {
  try {
    const building = await Building.create(req.body);
    res.status(201).json({ success: true, message: 'Building created', building });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBuilding = async (req, res) => {
  try {
    const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Building updated', building });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBuilding = async (req, res) => {
  try {
    await Building.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Building deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBuildingStats = async (req, res) => {
  try {
    const total = await Building.countDocuments();
    const critical = await Building.countDocuments({ status: 'critical' });
    const poor = await Building.countDocuments({ status: 'poor' });
    const fair = await Building.countDocuments({ status: 'fair' });
    const good = await Building.countDocuments({ status: 'good' });
    const excellent = await Building.countDocuments({ status: 'excellent' });

    const avgScore = await Building.aggregate([
      { $group: { _id: null, average: { $avg: '$compositeScore' } } },
    ]);

    res.json({
      success: true,
      stats: { total, critical, poor, fair, good, excellent, averageScore: avgScore[0]?.average || 0 },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
