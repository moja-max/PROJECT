import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { buildingAPI, inspectionAPI, taskAPI, alertAPI } from '../utils/api';

const Reports = () => {
  const [reportType, setReportType] = useState('inspection');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [buildingsRes, inspectionsRes, tasksRes, alertsRes] = await Promise.all([
        buildingAPI.getAll(),
        inspectionAPI.getAll(),
        taskAPI.getAll(),
        alertAPI.getAll({ isResolved: false }),
      ]);
      setBuildings(buildingsRes.data.buildings || []);
      setInspections(inspectionsRes.data.inspections || []);
      setTasks(tasksRes.data.tasks || []);
      setAlerts(alertsRes.data.alerts || []);
    } catch (error) {
      console.error('Failed to load report data:', error);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const filteredInspections = inspections.filter((inspection) => inspection.building);
      const filteredTasks = tasks.filter((task) => task.status);
      const filteredAlerts = alerts.filter((alert) => alert.building);

      const buildingStatusCounts = buildings.reduce((acc, building) => {
        const status = building.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const taskStatusCounts = filteredTasks.reduce((acc, task) => {
        const status = task.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const alertSeverityCounts = filteredAlerts.reduce((acc, alert) => {
        const severity = alert.severity || 'info';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      }, {});

      const inspectionAverage = filteredInspections.length
        ? (filteredInspections.reduce((sum, item) => sum + (item.compositeScore || 0), 0) / filteredInspections.length).toFixed(1)
        : '0.0';

      const typeLabels = {
        inspection: 'Full Inspection Report',
        summary: 'Condition Summary',
        maintenance: 'Maintenance Task Report',
        portfolio: 'Portfolio Overview',
      };

      const data = {
        type: typeLabels[reportType] || 'Custom Report',
        generatedAt: new Date().toLocaleString(),
        highlights: [],
        summary: {},
        buildings: buildings.slice(0, 8),
        inspections: filteredInspections.slice(0, 8),
        tasks: filteredTasks.slice(0, 8),
        alerts: filteredAlerts.slice(0, 8),
      };

      if (reportType === 'inspection') {
        data.highlights = [
          `Recorded ${filteredInspections.length} inspection entries`,
          `Average inspection score: ${inspectionAverage}/5.0`,
          `Latest inspection focus: ${filteredInspections[0]?.generalNotes || 'No notes available'}`,
        ];
        data.summary = {
          buildings: buildings.length,
          inspections: filteredInspections.length,
          averageScore: inspectionAverage,
        };
      } else if (reportType === 'summary') {
        data.highlights = [
          `Critical buildings: ${buildingStatusCounts.critical || 0}`,
          `Poor condition buildings: ${buildingStatusCounts.poor || 0}`,
          `Active alerts: ${filteredAlerts.length}`,
        ];
        data.summary = {
          buildings: buildings.length,
          critical: buildingStatusCounts.critical || 0,
          poor: buildingStatusCounts.poor || 0,
          alerts: filteredAlerts.length,
        };
      } else if (reportType === 'maintenance') {
        data.highlights = [
          `Pending tasks: ${taskStatusCounts.pending || 0}`,
          `In progress tasks: ${taskStatusCounts['in-progress'] || 0}`,
          `Completed tasks: ${taskStatusCounts.completed || 0}`,
        ];
        data.summary = {
          tasks: filteredTasks.length,
          pending: taskStatusCounts.pending || 0,
          inProgress: taskStatusCounts['in-progress'] || 0,
          completed: taskStatusCounts.completed || 0,
        };
      } else if (reportType === 'portfolio') {
        data.highlights = [
          `Portfolio size: ${buildings.length} buildings`,
          `Excellent buildings: ${buildingStatusCounts.excellent || 0}`,
          `Good buildings: ${buildingStatusCounts.good || 0}`,
          `Alert severity mix: ${alertSeverityCounts.critical || 0} critical / ${alertSeverityCounts.warning || 0} warning`,
        ];
        data.summary = {
          buildings: buildings.length,
          excellent: buildingStatusCounts.excellent || 0,
          good: buildingStatusCounts.good || 0,
          criticalAlerts: alertSeverityCounts.critical || 0,
        };
      }

      setReportData(data);
      setMessage({ type: 'success', text: `${data.type} generated successfully.` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Unable to generate report.' });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const margin = 16;
    let y = 20;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('HeritageCare Admin Report', margin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${reportData.type}`, margin, y);
    y += 7;
    doc.text(`Generated: ${reportData.generatedAt}`, margin, y);
    y += 12;

    doc.setFont('helvetica', 'bold');
    doc.text('Summary', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');

    Object.entries(reportData.summary).forEach(([key, value]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${key.replace(/([A-Z])/g, ' $1')}: ${value}`, margin, y);
      y += 6;
    });

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Highlights', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');

    reportData.highlights.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 6;
    });

    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Key Records', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');

    const records = reportType === 'maintenance' ? reportData.tasks : reportType === 'inspection' ? reportData.inspections : reportData.buildings;
    records.forEach((item, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const label = reportType === 'maintenance' ? `${item.title || 'Task'}` : reportType === 'inspection' ? `${item.building?.name || 'Inspection'}` : `${item.name || 'Building'}`;
      const line = `${index + 1}. ${label}`;
      doc.text(line, margin, y);
      y += 6;
    });

    doc.save(`${reportType}-report.pdf`);
  };

  return (
    <div className="content">
      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Generate Admin Report</div>
          </div>
          <div className="card-body">
            {message && <div className={`alert-banner ${message.type === 'error' ? 'alert-critical' : 'alert-info'}`} style={{ marginBottom: '12px' }}>{message.text}</div>}
            <div className="form-group">
              <label className="form-label">Report Type</label>
              <select className="form-control" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="inspection">Full Inspection Report</option>
                <option value="summary">Condition Summary</option>
                <option value="maintenance">Maintenance Task Report</option>
                <option value="portfolio">Portfolio Overview</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reporting Scope</label>
              <div className="alert-banner alert-info" style={{ marginBottom: 0 }}>
                <span>ℹ️</span>
                <span>Admin reports use current building, inspection, task and alert data from the system.</span>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleGenerateReport} disabled={loading}>
              📄 {loading ? 'Generating...' : 'Generate Report'}
            </button>
            {reportData && (
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '10px' }} onClick={downloadReport}>
                ⬇ Download PDF
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Current Report Summary</div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {reportData ? (
              <div style={{ padding: '16px' }}>
                <div style={{ marginBottom: '12px' }}><strong>Type:</strong> {reportData.type}</div>
                <div style={{ marginBottom: '12px' }}><strong>Generated:</strong> {reportData.generatedAt}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {Object.entries(reportData.summary).map(([key, value]) => (
                    <div key={key} className="alert-banner alert-info">
                      <strong>{value}</strong> {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '12px' }}>
                  <strong>Highlights</strong>
                  <ul style={{ marginTop: '8px', paddingLeft: '18px' }}>
                    {reportData.highlights.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>No report generated yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
