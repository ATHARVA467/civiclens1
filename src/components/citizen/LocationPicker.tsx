import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  address?: string;
}

// Custom location marker icon
const pickerIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="
      background-color: #294563;
      width: 28px;
      height: 28px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: #FFFFFF;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

// Map click handler helper component
function MapEventsHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  address
}) => {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        onLocationChange(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setGeoLoading(false);
        console.warn('Geolocation error:', error.message);
        // Fallback gracefully to municipal coordinates if permission denied
        setGeoError('Location permission denied or unavailable. You can click on the map to set location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-[#263442] uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#294563]" />
          <span>Select Issue Location on Map</span>
          <span className="text-[#B85D5D]">*</span>
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={geoLoading}
          className={clsx(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
            geoLoading
              ? 'bg-[#F0F2EF] text-[#687786] border-[#E3E7E8] cursor-not-allowed'
              : 'bg-white text-[#294563] border-[#7189A4]/40 hover:bg-[#F8F8F5] shadow-soft-sm'
          )}
        >
          <Crosshair className={clsx('w-3.5 h-3.5 text-[#7189A4]', geoLoading && 'animate-spin')} />
          <span>{geoLoading ? 'Detecting GPS...' : 'Use My Current Location'}</span>
        </button>
      </div>

      {geoError && (
        <div className="p-2.5 rounded-lg bg-[#B9853F]/10 border border-[#B9853F]/30 text-xs text-[#8f642a] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Map Card */}
      <div className="rounded-xl overflow-hidden border border-[#E3E7E8] shadow-soft-sm relative z-0">
        <div className="h-64 sm:h-72 w-full">
          <MapContainer
            center={[latitude, longitude]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[latitude, longitude]}
              icon={pickerIcon}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  onLocationChange(position.lat, position.lng);
                },
              }}
            />
            <MapEventsHandler onLocationChange={onLocationChange} />
          </MapContainer>
        </div>

        {/* Location Footer Bar */}
        <div className="p-2.5 bg-[#F8F8F5] border-t border-[#E3E7E8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#687786]">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#294563]">Tip:</span>
            <span>Click map or drag the pin to pinpoint the exact pothole or hazard.</span>
          </div>
          <div className="font-mono text-[11px] font-bold text-[#294563] bg-white px-2 py-0.5 rounded border border-[#E3E7E8]">
            {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
          </div>
        </div>
      </div>
    </div>
  );
};

