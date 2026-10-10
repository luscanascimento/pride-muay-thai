import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, RotateCcw } from 'lucide-react';
import { Gym } from '../../types/gymsAndTeam';
import { getGymWhatsAppUrl, getGymExternalMapsUrl } from '../../data/gymsAndTeamData';

interface GymsMapProps {
  gyms: Gym[];
  selectedGymId?: string | null;
  onMarkerSelect?: (gymId: string) => void;
}

export const GymsMap: React.FC<GymsMapProps> = ({ gyms, selectedGymId, onMarkerSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [gymId: string]: L.Marker }>({});
  const onMarkerSelectRef = useRef(onMarkerSelect);
  onMarkerSelectRef.current = onMarkerSelect;

  // Filter gyms with valid coordinates
  const mappedGyms = gyms.filter((g) => g.coordinates !== null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization if already exists
    if (mapInstanceRef.current) return;

    // Initial center (Vale do Paraíba - Jacareí / SJC area)
    const initialCenter: [number, number] = [-23.29, -45.96];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 11,
      scrollWheelZoom: false, // Prevents scroll hijacking on page scroll
      attributionControl: true,
    });

    // Dark theme CartoDB basemap with OpenStreetMap data
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add markers for all gyms with coordinates
    const bounds = L.latLngBounds([]);

    mappedGyms.forEach((gym) => {
      if (!gym.coordinates) return;

      const latLng: [number, number] = [gym.coordinates.lat, gym.coordinates.lng];
      bounds.extend(latLng);

      // Custom Pride combat pin HTML
      const iconHtml = `
        <div class="group/pin relative flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-full transition-transform hover:scale-110">
          <div class="w-8 h-8 rounded-full bg-[#181820] border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)] flex items-center justify-center text-red-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-red-600 rotate-45"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-pride-pin',
        html: iconHtml,
        iconSize: [32, 36],
        iconAnchor: [16, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      // Custom Styled Popup Content
      const whatsappUrl = getGymWhatsAppUrl(gym);
      const mapsUrl = getGymExternalMapsUrl(gym);

      const schedulesSummary = gym.schedules
        .map((s) => `<div class="text-xs text-zinc-300"><strong>${s.days}:</strong> ${s.hours}</div>`)
        .join('');

      const popupContent = `
        <div class="p-4 bg-[#121217] text-zinc-100 rounded-xl min-w-[240px] max-w-[280px]">
          <div class="flex items-center gap-1.5 text-[11px] font-mono text-red-400 uppercase tracking-wider font-semibold mb-1">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            ${gym.city}
          </div>
          <h4 class="font-fight text-xl uppercase tracking-wide text-white leading-tight mb-2">
            ${gym.name}
          </h4>
          ${
            gym.address
              ? `<p class="text-xs text-zinc-400 mb-3 leading-snug flex items-start gap-1">
                  <span class="text-red-500 mt-0.5">•</span>
                  ${gym.address}
                </p>`
              : ''
          }
          
          <div class="p-2.5 rounded bg-zinc-900/90 border border-zinc-800/80 mb-3 space-y-1">
            <span class="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">Horários de Aula:</span>
            ${schedulesSummary}
          </div>

          <div class="flex flex-col gap-2 pt-1">
            ${
              whatsappUrl
                ? `<a
                    href="${whatsappUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md text-center"
                  >
                    Falar com a Academia
                  </a>`
                : ''
            }
            ${
              mapsUrl
                ? `<a
                    href="${mapsUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors py-1"
                  >
                    <span>Abrir no Google Maps</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>`
                : ''
            }
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'pride-leaflet-popup',
        maxWidth: 320,
      });

      marker.on('click', () => {
        onMarkerSelectRef.current?.(gym.id);
      });

      markersRef.current[gym.id] = marker;
    });

    if (mappedGyms.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mappedGyms]);

  // When selectedGymId changes externally, focus and open popup
  useEffect(() => {
    if (!selectedGymId || !mapInstanceRef.current) return;

    const gym = mappedGyms.find((g) => g.id === selectedGymId);
    const marker = markersRef.current[selectedGymId];

    if (gym && gym.coordinates && marker) {
      mapInstanceRef.current.flyTo([gym.coordinates.lat, gym.coordinates.lng], 15, {
        duration: 1.2,
      });
      setTimeout(() => {
        marker.openPopup();
      }, 700);
    }
  }, [selectedGymId, mappedGyms]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([]);
    mappedGyms.forEach((g) => {
      if (g.coordinates) bounds.extend([g.coordinates.lat, g.coordinates.lng]);
    });
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0e0e12]">
      {/* Map toolbar */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[400] flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[#0e0e13]/90 backdrop-blur-md border border-zinc-800 text-xs font-mono text-zinc-300 shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span>{mappedGyms.length} unidades no mapa interativo</span>
        </div>

        <button
          type="button"
          onClick={handleResetView}
          className="px-3 py-1.5 rounded-lg bg-[#0e0e13]/90 hover:bg-zinc-900 backdrop-blur-md border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-200 transition-colors shadow-lg flex items-center gap-1.5 cursor-pointer"
          title="Restaurar enquadramento do mapa"
        >
          <RotateCcw size={13} className="text-red-400" />
          <span>Ver todas</span>
        </button>
      </div>

      {/* Actual Map Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-[420px] sm:h-[500px] lg:h-[540px] z-0 focus:outline-none"
        aria-label="Mapa interativo com a localização das academias da Pride Muay Thai"
      />

      {/* Bottom disclaimer for units without confirmed address */}
      <div className="px-4 py-2.5 bg-[#0a0a0d] border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <MapPin size={12} className="text-red-500 flex-shrink-0" />
          Marcadores representam endereços físicos verificados.
        </span>
        <span className="text-zinc-500">
          Unidades sem endereço no mapa (ex.: VG, Projeto VG): consulte diretamente pelo WhatsApp da unidade.
        </span>
      </div>
    </div>
  );
};
