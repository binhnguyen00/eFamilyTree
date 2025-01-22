import React from "react";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

export interface Coordinate {
  lat: number;
  lng: number;
}

interface WorldMapProps {
  initLocation?: Coordinate;
  zoom?: number;
  addMarker?: Coordinate;
  onMarkerClick?: (coordinate: Coordinate) => void;
  popupContent?: string | ((coordinate: Coordinate) => string);
}

export function WorldMap(props: WorldMapProps) {
  const { 
    initLocation = { lat: 20.81837730031204, lng: 106.69754943953069 },
    zoom = 18,
    addMarker,
    onMarkerClick,
    popupContent = "Toạ Độ"
  } = props;

  const { mapRef, markersRef } = useMap({ initLocation, zoom });

  useAddMarkerListener({
    mapRef: mapRef,
    markersRef: markersRef,
    coordinate: addMarker,
    popupContent: popupContent,
    onMarkerClick: onMarkerClick,
  })

  return (
    <div
      id="map"
      style={{
        height: "50vh",
        width: "100%",
      }}
    />
  );
}

// ========================
// useMap
// ========================
interface UseMapProps {
  zoom: number;
  initLocation: Coordinate;
}
function useMap(props: UseMapProps) {
  const { initLocation, zoom } = props;

  const mapRef = React.useRef<Leaflet.Map | null>(null);
  const markersRef = React.useRef<Leaflet.Marker[]>([]);

  React.useEffect(() => {
    mapRef.current = Leaflet
      .map("map")
      .setView([initLocation.lat, initLocation.lng], zoom);

    Leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        detectRetina: true,
        maxZoom: 23,
        attribution: "Gia Phả Lạc Hồng"
      })
      .addTo(mapRef.current);

    // Remove attribution
    const attribution = document.querySelector('a[href="https://leafletjs.com"]');
    if (attribution) attribution.remove();

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [ ])

  return {
    mapRef, markersRef
  }
}

// ========================
// use Add Marker
// ========================
interface UseAddMarkerProps {
  mapRef: React.RefObject<Leaflet.Map>;
  markersRef: React.RefObject<Leaflet.Marker[]>;
  coordinate?: Coordinate;
  onMarkerClick?: (coordinate: Coordinate) => void;
  popupContent?: string | ((coordinate: Coordinate) => string);
}
function useAddMarkerListener(props: UseAddMarkerProps) {
  const { mapRef, markersRef, coordinate, onMarkerClick, popupContent } = props;

  React.useEffect(() => {
    if (!mapRef.current || !markersRef.current || !coordinate) return;

    const marker = Leaflet
      .marker([coordinate.lat, coordinate.lng])
      .addTo(mapRef.current);

    if (popupContent) {
      marker.bindPopup(typeof popupContent === 'function' ? popupContent(coordinate) : popupContent)
    }

    if (onMarkerClick) {
      marker.on('click', () => onMarkerClick(coordinate));
    }

    // Store marker reference
    markersRef.current.push(marker);
    // Center map on new marker
    mapRef.current.setView([coordinate.lat, coordinate.lng], mapRef.current.getZoom());

  }, [ coordinate, onMarkerClick, popupContent ]);
}