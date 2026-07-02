export const getScoreColor = (score) => {
  if (score <= 2.0) return '#c0392b';
  if (score <= 2.5) return '#e07030';
  if (score <= 3.0) return '#e8a020';
  if (score <= 4.0) return '#27ae60';
  return '#1565c0';
};

export const getScoreStatus = (score) => {
  if (score <= 2.0) return 'critical';
  if (score <= 2.5) return 'poor';
  if (score <= 3.0) return 'fair';
  if (score <= 4.0) return 'good';
  return 'excellent';
};

export const getStatusLabel = (status) => {
  const labels = {
    critical: 'Critical',
    poor: 'Poor',
    fair: 'Fair',
    good: 'Good',
    excellent: 'Excellent',
  };
  return labels[status] || status;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateCompositeScore = (ratings) => {
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
    if (ratings[key]) {
      score += ratings[key] * weights[key];
    }
  });
  return score;
};
