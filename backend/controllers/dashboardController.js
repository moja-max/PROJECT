import Building from '../models/Building.js';
import Inspection from '../models/Inspection.js';
import MaintenanceTask from '../models/MaintenanceTask.js';
import Alert from '../models/Alert.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalBuildings = await Building.countDocuments();
    const criticalBuildings = await Building.countDocuments({ status: 'critical' });
    const needAttention = await Building.countDocuments({ status: { $in: ['critical', 'poor'] } });
    const openTasks = await MaintenanceTask.countDocuments({ status: { $ne: 'completed' } });
    const overdueTasks = await MaintenanceTask.countDocuments({
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() },
    });

    const recentInspections = await Inspection.find()
      .populate('building', 'name registrationNumber')
      .populate('inspector', 'fullName')
      .sort({ inspectionDate: -1 })
      .limit(5);

    const activeAlerts = await Alert.find({ isResolved: false })
      .populate('building', 'name')
      .sort({ triggeredAt: -1 })
      .limit(3);

    const buildingsByStatus = await Building.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      dashboard: {
        totalBuildings,
        criticalBuildings,
        needAttention,
        openTasks,
        overdueTasks,
        recentInspections,
        activeAlerts,
        buildingsByStatus: Object.fromEntries(
          buildingsByStatus.map((item) => [item._id, item.count])
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolioTrend = async (req, res) => {
  try {
    const months = 6;
    const trend = [];

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - i);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const inspections = await Inspection.find({
        inspectionDate: { $gte: startDate, $lt: endDate },
      });

      const avgScore = inspections.length > 0
        ? inspections.reduce((sum, insp) => sum + insp.compositeScore, 0) / inspections.length
        : 0;

      trend.push({
        month: startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        averageScore: parseFloat(avgScore.toFixed(2)),
      });
    }

    res.json({ success: true, trend });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
