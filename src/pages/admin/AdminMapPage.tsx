import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { SYNTHETIC_REPORTS, SYNTHETIC_HOTSPOTS } from '@/lib/syntheticData';
import { Report, ReportCategory, PriorityBand } from '@/types';
import { Card } from '@/components/common/Card';
import { StatusBadge, PriorityBadge, CategoryBadge } from '@/components/common/Badges';
import { MapPin, Filter, Flame, Eye, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

// Create custom accessible div icons with SVG pins
const createCustomIcon = (priority: PriorityBand) => {
  const colorMap: Record<PriorityBand, string> = {
    Critical: '#C77A7A',
    High: '#D1A15D',
    Medium: '#8EA8C2',
    Low: '#7C9B85',
  };

  const bg = colorMap[priority] || '#8EA8C2';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${bg};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        font-size: 10px;
        font-weight: bold;
      ">
        •
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export const AdminMapPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showHotspots, setShowHotspots] = useState(true);

  const filteredReports = SYNTHETIC_REPORTS.filter((r) => {
    const catMatch = selectedCategory === 'all' || r.category === selectedCategory;
    const prioMatch = selectedPriority === 'all' || r.priority_band === selectedPriority;
    return catMatch && prioMatch;
  });

  // Center around Bangalore sample coords
  const centerLat = 12.9716;
  const centerLng = 77.5946;

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F3F5F6] tracking-tight">
            Geographic GIS Intelligence
          </h1>
          <p className="text-xs text-[#A8B5C1] mt-0.5">
            Spatial distribution, priority pins and multi-report infrastructure clusters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#1C2C3D] border border-[#304153] text-[#F3F5F6] focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Drainage & Waterlogging">Drainage & Waterlogging</option>
            <option value="Roads & Potholes">Roads & Potholes</option>
            <option value="Garbage & Sanitation">Garbage & Sanitation</option>
            <option value="Streetlights">Streetlights</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electrical Hazards">Electrical Hazards</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-[#1C2C3D] border border-[#304153] text-[#F3F5F6] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>

          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            className={clsx(
              'px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5',
              showHotspots
                ? 'bg-[#8EA8C2] text-[#111A24] border-[#8EA8C2]'
                : 'bg-[#1C2C3D] text-[#A8B5C1] border-[#304153]'
            )}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hotspots {showHotspots ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <Card variant="admin" className="overflow-hidden p-1 border-[#304153]">
        <div className="h-[580px] w-full rounded-lg overflow-hidden relative z-0">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Hotspots overlay circles */}
            {showHotspots &&
              SYNTHETIC_HOTSPOTS.map((hotspot) => (
                <Circle
                  key={hotspot.id}
                  center={[hotspot.latitude, hotspot.longitude]}
                  radius={hotspot.radius_meters}
                  pathOptions={{
                    color: hotspot.severity === 'critical' ? '#C77A7A' : '#D1A15D',
                    fillColor: hotspot.severity === 'critical' ? '#C77A7A' : '#D1A15D',
                    fillOpacity: 0.25,
                    weight: 2,
                    dashArray: '4, 4'
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 p-1 max-w-xs">
                      <div className="font-bold text-[#294563] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-600" />
                        <span>{hotspot.name}</span>
                      </div>
                      <p className="text-gray-700 leading-snug">{hotspot.ai_brief_summary}</p>
                      <div className="pt-1 text-[11px] font-semibold text-rose-700">
                        Density: {hotspot.report_count} clustered grievances
                      </div>
                    </div>
                  </Popup>
                </Circle>
              ))}

            {/* Individual Report Pins */}
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={createCustomIcon(report.priority_band)}
              >
                <Popup>
                  <div className="text-xs space-y-2 p-1 max-w-xs">
                    <div className="flex items-center gap-1 font-mono font-bold text-[#294563]">
                      <span>{report.tracking_token}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 font-sans">
                        {report.priority_band}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900">{report.title}</div>
                    <p className="text-gray-600 text-[11px] line-clamp-2">{report.description}</p>
                    <div className="text-gray-500 text-[10px]">{report.address}</div>
                    <div className="pt-1 border-t border-gray-200">
                      <Link
                        to={`/track/${report.tracking_token}`}
                        className="text-[#294563] font-bold text-[11px] hover:underline"
                      >
                        Inspect Full Dossier →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </Card>

      {/* Legend & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-[#1C2C3D] border border-[#304153] flex items-center gap-2.5 text-xs text-[#F3F5F6]">
          <span className="w-3 h-3 rounded-full bg-[#C77A7A] shrink-0" />
          <div>
            <div className="font-semibold">Critical Priority</div>
            <div className="text-[10px] text-[#A8B5C1]">Immediate life-safety response</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#1C2C3D] border border-[#304153] flex items-center gap-2.5 text-xs text-[#F3F5F6]">
          <span className="w-3 h-3 rounded-full bg-[#D1A15D] shrink-0" />
          <div>
            <div className="font-semibold">High Priority</div>
            <div className="text-[10px] text-[#A8B5C1]">Major public impact & obstruction</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#1C2C3D] border border-[#304153] flex items-center gap-2.5 text-xs text-[#F3F5F6]">
          <span className="w-3 h-3 rounded-full bg-[#8EA8C2] shrink-0" />
          <div>
            <div className="font-semibold">Medium Priority</div>
            <div className="text-[10px] text-[#A8B5C1]">Standard scheduled maintenance</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#1C2C3D] border border-[#304153] flex items-center gap-2.5 text-xs text-[#F3F5F6]">
          <span className="w-3 h-3 rounded-full bg-[#7C9B85] shrink-0" />
          <div>
            <div className="font-semibold">Low Priority</div>
            <div className="text-[10px] text-[#A8B5C1]">Routine civic observation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

