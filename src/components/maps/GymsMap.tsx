import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, RotateCcw, Loader2 } from 'lucide-react';
import { Gym } from '../../types/gymsAndTeam';
import { getGymWhatsAppUrl, getGymExternalMapsUrl } from '../../data/gymsAndTeamData';

// Public Mapbox access token configured via Vite environment variable
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface GymsMapProps {
  gyms: Gym[];
  selectedGymId?: string | null;
  onMarkerSelect?: (gymId: string) => void;
}

export const GymsMap: React.FC<GymsMapProps> = ({ gyms, selectedGymId, onMarkerSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [gymId: string]: { marker: mapboxgl.Marker; popup: mapboxgl.Popup } }>({});
  
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const onMarkerSelectRef = useRef(onMarkerSelect);
  onMarkerSelectRef.current = onMarkerSelect;

  // Filter gyms with confirmed coordinates
  const mappedGyms = gyms.filter((g) => g.coordinates !== null);

  // Lazy initialization: only load Mapbox when the user scrolls near the map section
  useEffect(() => {
    if (!containerRef.current || isNearViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isNearViewport]);

  // Initialize Mapbox map instance once when in view
  useEffect(() => {
    if (!isNearViewport || !mapElementRef.current || mapInstanceRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Calculate initial bounding box across all confirmed gyms
    const bounds = new mapboxgl.LngLatBounds();
    mappedGyms.forEach((gym) => {
      if (gym.coordinates) {
        bounds.extend([gym.coordinates.lng, gym.coordinates.lat]);
      }
    });

    const map = new mapboxgl.Map({
      container: mapElementRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-45.96, -23.29], // Vale do Paraíba fallback center
      zoom: 11,
      scrollZoom: false, // Prevents scroll hijacking on mobile/desktop
      dragRotate: false,
      attributionControl: true,
    });

    // Add navigation controls (zoom in/out)
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      setMapLoaded(true);

      // Fit bounds to show all markers with comfortable padding
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          maxZoom: 13.5,
          duration: 1000,
        });
      }
    });

    // Create markers and popups for each confirmed gym
    mappedGyms.forEach((gym) => {
      if (!gym.coordinates) return;

      const lngLat: [number, number] = [gym.coordinates.lng, gym.coordinates.lat];

      // Custom DOM element for Pride Muay Thai red combat pin
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-pride-pin group/pin';
      markerEl.setAttribute('role', 'button');
      markerEl.setAttribute('aria-label', `Marcador de ${gym.name}`);
      markerEl.innerHTML = `
        <div class="relative flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110">
          <div class="w-8 h-8 rounded-full bg-[#14141a] border-2 border-red-600 shadow-[0_0_16px_rgba(220,38,38,0.75)] flex items-center justify-center text-red-500">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="-mt-1 w-2 h-2 bg-red-600 rotate-45"></div>
        </div>
      `;

      // Build popup content
      const whatsappUrl = getGymWhatsAppUrl(gym);
      const mapsUrl = getGymExternalMapsUrl(gym);
      const schedulesSummary = gym.schedules
        .map((s) => `<div class="text-xs text-zinc-300"><strong class="text-zinc-200">${s.days}:</strong> ${s.hours}</div>`)
        .join('');

      const popupHtml = `
        <div class="p-4 bg-[#121217] text-zinc-100 rounded-xl min-w-[240px] max-w-[290px]">
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

      const popup = new mapboxgl.Popup({
        offset: [0, -32],
        closeButton: true,
        closeOnClick: false,
        className: 'pride-mapbox-popup',
        maxWidth: '320px',
      }).setHTML(popupHtml);

      const marker = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom',
      })
        .setLngLat(lngLat)
        .setPopup(popup)
        .addTo(map);

      markerEl.addEventListener('click', () => {
        onMarkerSelectRef.current?.(gym.id);
      });

      markersRef.current[gym.id] = { marker, popup };
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
      setMapLoaded(false);
    };
  }, [isNearViewport, mappedGyms]);

  // When selectedGymId changes externally, smooth flyTo and open popup
  useEffect(() => {
    if (!selectedGymId || !mapInstanceRef.current || !mapLoaded) return;

    const gym = mappedGyms.find((g) => g.id === selectedGymId);
    const item = markersRef.current[selectedGymId];

    if (gym && gym.coordinates && item) {
      mapInstanceRef.current.flyTo({
        center: [gym.coordinates.lng, gym.coordinates.lat],
        zoom: 15,
        duration: 1300,
        essential: true,
      });

      // Close all other popups and open this one
      Object.values(markersRef.current).forEach((m) => m.popup.remove());
      setTimeout(() => {
        item.popup.addTo(mapInstanceRef.current!);
      }, 500);
    }
  }, [selectedGymId, mapLoaded, mappedGyms]);

  // Reset view to show all gyms
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const bounds = new mapboxgl.LngLatBounds();
    mappedGyms.forEach((g) => {
      if (g.coordinates) bounds.extend([g.coordinates.lng, g.coordinates.lat]);
    });
    if (!bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 13.5,
        duration: 1000,
      });
    }
    // Close popups on reset
    Object.values(markersRef.current).forEach((m) => m.popup.remove());
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0e0e12] p-8 text-center flex flex-col items-center justify-center min-h-[340px]">
        <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-500 mb-3">
          <MapPin size={24} />
        </div>
        <h4 className="font-fight text-2xl text-white uppercase tracking-wider mb-2">
          Mapa Interativo das Academias
        </h4>
        <p className="text-zinc-400 text-sm max-w-md mb-4 leading-relaxed">
          Para exibir o mapa Mapbox GL, configure a variável de ambiente <code className="text-red-400 bg-zinc-900 px-2 py-0.5 rounded font-mono text-xs">VITE_MAPBOX_ACCESS_TOKEN</code> no arquivo <code className="text-zinc-300 font-mono text-xs">.env.local</code> ou nos segredos de CI/CD.
        </p>
        <span className="text-xs text-zinc-500 font-mono">
          Consulte as unidades e endereços na lista de academias acima.
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0e0e12]"
    >
      {/* Map toolbar */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
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

      {/* Loading placeholder when map is not yet in view */}
      {!isNearViewport && (
        <div className="w-full h-[420px] sm:h-[500px] lg:h-[540px] flex flex-col items-center justify-center bg-[#0d0d11] text-zinc-400">
          <Loader2 size={32} className="text-red-500 animate-spin mb-3" />
          <span className="text-xs font-mono uppercase tracking-wider">Carregando mapa interativo...</span>
        </div>
      )}

      {/* Mapbox Canvas Container */}
      <div
        ref={mapElementRef}
        className={`w-full h-[420px] sm:h-[500px] lg:h-[540px] z-0 focus:outline-none ${
          !isNearViewport ? 'hidden' : 'block'
        }`}
        aria-label="Mapa interativo Mapbox com as academias da Pride Muay Thai"
      />

      {/* Bottom disclaimer for units without confirmed physical address */}
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
