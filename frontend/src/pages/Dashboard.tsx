import { useState, useEffect } from 'react';
import { AlertTriangle, Camera, ShieldAlert, CheckCircle, TrendingUp, Flame } from 'lucide-react';
import IncidentCard from '../components/IncidentCard';
import Map2D from '../components/Map2D';
import BoundingBoxViewer from '../components/BoundingBoxViewer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Demo data for full UI demonstration
const demoStats = {
  total: 47,
  new: 12,
  resolved: 28,
  cameras: 8,
};

const demoIncidents = [
  { id: '1', type: 'fire', severity: 'critical', description: 'Smoke detected near Workshop A', location: 'Workshop A', confidence: 0.94, status: 'new', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: '2', type: 'ppe_violation', severity: 'high', description: 'Worker without hard hat', location: 'Main Hall', confidence: 0.87, status: 'new', created_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: '3', type: 'unsafe_behavior', severity: 'medium', description: 'Unauthorized area access', location: 'Storage Area', confidence: 0.72, status: 'acknowledged', created_at: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: '4', type: 'ppe_violation', severity: 'medium', description: 'Missing safety goggles', location: 'Workshop A', confidence: 0.81, status: 'new', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '5', type: 'fire', severity: 'high', description: 'Heat anomaly detected', location: 'Storage Area', confidence: 0.68, status: 'resolved', created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
];

const demoCameras = [
  { id: 'c1', name: 'CAM-01', status: 'active' as const, x: 25, y: 30 },
  { id: 'c2', name: 'CAM-02', status: 'active' as const, x: 40, y: 25 },
  { id: 'c3', name: 'CAM-03', status: 'alert' as const, x: 70, y: 25 },
  { id: 'c4', name: 'CAM-04', status: 'active' as const, x: 15, y: 50 },
  { id: 'c5', name: 'CAM-05', status: 'inactive' as const, x: 50, y: 70 },
  { id: 'c6', name: 'CAM-06', status: 'active' as const, x: 75, y: 72 },
];

const demoChartData = [
  { name: 'Mon', fire: 2, ppe: 5, unsafe: 3 },
  { name: 'Tue', fire: 1, ppe: 8, unsafe: 2 },
  { name: 'Wed', fire: 3, ppe: 4, unsafe: 6 },
  { name: 'Thu', fire: 0, ppe: 7, unsafe: 4 },
  { name: 'Fri', fire: 2, ppe: 3, unsafe: 1 },
  { name: 'Sat', fire: 1, ppe: 2, unsafe: 2 },
  { name: 'Sun', fire: 0, ppe: 1, unsafe: 1 },
];

const demoBBoxes = [
  { x: 20, y: 15, width: 25, height: 35, label: 'No Helmet', confidence: 0.92, type: 'ppe_violation' },
  { x: 60, y: 40, width: 15, height: 20, label: 'Fire', confidence: 0.87, type: 'fire' },
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-[calc(64px+24px)] px-4 md:px-8 pb-12 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary text-[0.925rem] mt-1">Real-time safety monitoring overview</p>
        </div>
        <div className="flex items-center gap-3 text-text-muted text-[0.85rem]">
          <span className="w-2 h-2 rounded-full inline-block bg-success shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
          System Active — {currentTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-bg-card border border-border-default rounded-xl p-6 shadow-sm transition-all duration-200 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md hover:border-accent-primary before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-xl before:bg-accent-primary">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-accent-primary/20 text-accent-primary">
              <ShieldAlert size={22} />
            </div>
            <div className="text-[0.8rem] font-semibold flex items-center gap-1 text-success">
              <TrendingUp size={14} />
              +12%
            </div>
          </div>
          <div className="text-3xl font-extrabold leading-none text-text-primary">{demoStats.total}</div>
          <div className="text-[0.8rem] font-medium text-text-muted uppercase tracking-wider mt-2">Total Incidents</div>
        </div>

        <div className="bg-bg-card border border-border-default rounded-xl p-6 shadow-sm transition-all duration-200 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md hover:border-accent-primary before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-xl before:bg-danger">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-danger/20 text-danger">
              <AlertTriangle size={22} />
            </div>
          </div>
          <div className="text-3xl font-extrabold leading-none text-text-primary">{demoStats.new}</div>
          <div className="text-[0.8rem] font-medium text-text-muted uppercase tracking-wider mt-2">Active Alerts</div>
        </div>

        <div className="bg-bg-card border border-border-default rounded-xl p-6 shadow-sm transition-all duration-200 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md hover:border-accent-primary before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-xl before:bg-success">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-success/20 text-success">
              <CheckCircle size={22} />
            </div>
          </div>
          <div className="text-3xl font-extrabold leading-none text-text-primary">{demoStats.resolved}</div>
          <div className="text-[0.8rem] font-medium text-text-muted uppercase tracking-wider mt-2">Resolved</div>
        </div>

        <div className="bg-bg-card border border-border-default rounded-xl p-6 shadow-sm transition-all duration-200 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md hover:border-accent-primary before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:rounded-t-xl before:bg-accent-cyan">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-accent-cyan/20 text-accent-cyan">
              <Camera size={22} />
            </div>
          </div>
          <div className="text-3xl font-extrabold leading-none text-text-primary">{demoStats.cameras}</div>
          <div className="text-[0.8rem] font-medium text-text-muted uppercase tracking-wider mt-2">Active Cameras</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Incidents */}
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 px-6 border-b border-border-subtle">
            <h2 className="text-base font-bold text-text-primary">Recent Incidents</h2>
            <span className="text-[0.8rem] text-text-muted">
              {demoIncidents.length} latest
            </span>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-3">
              {demoIncidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  id={incident.id}
                  type={incident.type}
                  severity={incident.severity}
                  description={incident.description}
                  location={incident.location}
                  confidence={incident.confidence}
                  status={incident.status}
                  createdAt={incident.created_at}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Live Detection */}
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 px-6 border-b border-border-subtle">
            <h2 className="text-base font-bold text-text-primary">Live Detection</h2>
            <div className="flex items-center gap-1.5 text-[0.8rem] text-danger">
              <Flame size={14} />
              {demoBBoxes.length} active detections
            </div>
          </div>
          <div className="p-6">
            <BoundingBoxViewer boxes={demoBBoxes} />
          </div>
        </div>

        {/* 2D Map */}
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 px-6 border-b border-border-subtle">
            <h2 className="text-base font-bold text-text-primary">Camera Map</h2>
            <span className="text-[0.8rem] text-text-muted">
              {demoCameras.filter(c => c.status === 'active').length} / {demoCameras.length} online
            </span>
          </div>
          <div className="p-6">
            <Map2D cameras={demoCameras} />
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-bg-card border border-border-default rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 px-6 border-b border-border-subtle">
            <h2 className="text-base font-bold text-text-primary">Weekly Overview</h2>
            <span className="text-[0.8rem] text-text-muted">Last 7 days</span>
          </div>
          <div className="p-6">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demoChartData} barGap={2}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1f35',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: 8,
                      color: '#f0f4ff',
                      fontSize: '0.8rem',
                    }}
                  />
                  <Bar dataKey="fire" name="Fire" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ppe" name="PPE" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="unsafe" name="Unsafe" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex gap-6 justify-center mt-4">
              {[
                { label: 'Fire', color: '#ef4444' },
                { label: 'PPE Violations', color: '#f59e0b' },
                { label: 'Unsafe Behavior', color: '#6366f1' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5 text-[0.75rem] text-text-secondary">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
