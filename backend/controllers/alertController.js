import Alert from '../models/Alert.js';
import Building from '../models/Building.js';

export const getAlerts = async (req, res) => {
  try {
    const { severity, isResolved, limit = 50, skip = 0 } = req.query;
    let query = {};

    if (severity) query.severity = severity;
    if (isResolved !== undefined) query.isResolved = isResolved === 'true';

    const alerts = await Alert.find(query)
      .populate('building', 'name registrationNumber')
      .sort({ triggeredAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Alert.countDocuments(query);

    res.json({ success: true, total, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('building', 'name location');
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const { resolutionNotes } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        isResolved: true,
        resolvedDate: new Date(),
        resolvedBy: req.user.id,
        resolutionNotes,
      },
      { new: true }
    );

    res.json({ success: true, message: 'Alert resolved', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlertStats = async (req, res) => {
  try {
    const critical = await Alert.countDocuments({ severity: 'critical', isResolved: false });
    const warning = await Alert.countDocuments({ severity: 'warning', isResolved: false });
    const info = await Alert.countDocuments({ severity: 'info', isResolved: false });
    const resolved = await Alert.countDocuments({ isResolved: true });

    res.json({ success: true, stats: { critical, warning, info, resolved } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlertsByBuilding = async (req, res) => {
  try {
    const alerts = await Alert.find({ building: req.params.buildingId }).sort({ triggeredAt: -1 });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
