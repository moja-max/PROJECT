import Inspection from '../models/Inspection.js';
import Building from '../models/Building.js';
import Alert from '../models/Alert.js';

const calculateCompositeScore = (ratings) => {
  const weights = {
    roof: 0.2,
    walls: 0.2,
    windows: 0.15,
    foundation: 0.25,
    interior: 0.1,
    services: 0.1,
  };

  let score = 0;
  Object.keys(ratings).forEach((key) => {
    score += ratings[key] * weights[key];
  });
  return score;
};

const determineStatus = (score) => {
  if (score <= 2.0) return 'critical';
  if (score <= 2.5) return 'poor';
  if (score <= 3.0) return 'fair';
  if (score <= 4.0) return 'good';
  return 'excellent';
};

export const submitInspection = async (req, res) => {
  try {
    const { building, elementRatings, weatherConditions, generalNotes } = req.body;

    const compositeScore = calculateCompositeScore(elementRatings);

    const inspection = await Inspection.create({
      building,
      inspector: req.user.id,
      inspectionDate: new Date(),
      elementRatings,
      compositeScore,
      weatherConditions,
      generalNotes,
      status: 'submitted',
    });

    // Update building record
    const status = determineStatus(compositeScore);
    await Building.findByIdAndUpdate(
      building,
      {
        compositeScore,
        status,
        lastInspected: new Date(),
        $push: { scoreHistory: { date: new Date(), score: compositeScore, inspector: req.user.id } },
      },
      { new: true }
    );

    // If score is good (above threshold), resolve any unresolved alerts for this building
    if (compositeScore >= 2.5) {
      await Alert.updateMany(
        { building, isResolved: false },
        {
          isResolved: true,
          resolvedDate: new Date(),
          resolvedBy: req.user.id,
          resolutionNotes: `Building condition improved to ${compositeScore.toFixed(1)}/5.0 after maintenance inspection`,
        }
      );
    } else {
      // Create alert if score is critical or poor
      await Alert.create({
        building,
        severity: compositeScore <= 2.0 ? 'critical' : 'warning',
        type: 'condition_score_drop',
        score: compositeScore,
        message: `Building condition score ${compositeScore.toFixed(1)}/5.0 triggered ${
          compositeScore <= 2.0 ? 'critical' : 'warning'
        } alert`,
        triggeredAt: new Date(),
      });
    }

    res.status(201).json({ success: true, message: 'Inspection submitted', inspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInspectionsByBuilding = async (req, res) => {
  try {
    const inspections = await Inspection.find({ building: req.params.buildingId })
      .populate('inspector', 'fullName')
      .sort({ inspectionDate: -1 });
    res.json({ success: true, inspections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id)
      .populate('inspector', 'fullName email')
      .populate('building', 'name location');
    if (!inspection) {
      return res.status(404).json({ message: 'Inspection not found' });
    }
    res.json({ success: true, inspection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllInspections = async (req, res) => {
  try {
    const { status, limit = 20, skip = 0 } = req.query;
    let query = {};
    if (status) query.status = status;

    const inspections = await Inspection.find(query)
      .populate('building', 'name registrationNumber')
      .populate('inspector', 'fullName')
      .sort({ inspectionDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Inspection.countDocuments(query);

    res.json({ success: true, total, inspections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
