import React from "react";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

export interface Coordinate {
  lat: number;
  lng: number;
}

interface WorldMapProps {
  height?: string | number;
  locations?: any[];
  addMarker?: Coordinate;
  onMarkerClick?: (coordinate: Coordinate) => void;
}

export function WorldMap(props: WorldMapProps) {
  const { 
    height,
    locations,
    addMarker,
    onMarkerClick,
  } = props;

  const { mapRef, markersRef } = useMap({ coordinates: locations });

  useAddMarker({
    mapRef: mapRef,
    markersRef: markersRef,
    coordinate: addMarker,
    popupContent: "Toạ Độ",
    onMarkerClick: onMarkerClick,
  })

  return (
    <div
      className="rounded"
      id="map"
      style={{
        height: height,
        width: "100%",
      }}
    />
  );
}

// ========================
// useMap
// ========================
interface UseMapProps {
  coordinates?: any[]
}
function useMap(props: UseMapProps) {
  const { coordinates } = props;

  const mapRef = React.useRef<Leaflet.Map | null>(null);
  const markersRef = React.useRef<Leaflet.Marker[]>([]);

  // TODO: move to config.ts
  const initZoom = 13;
  const maxZoom = 23;
  const credit: any = "Gia Phả Lạc Hồng";
  const initLocation = { latitude: 20.81837730031204, longitude: 106.69754943953069 }

  const removeAttribution = () => {
    const attribution = document.querySelector('a[href="https://leafletjs.com"]');
    if (attribution) attribution.remove();
  }

  React.useEffect(() => {
    mapRef.current = Leaflet
      .map("map")
      .setView([initLocation.latitude, initLocation.longitude], initZoom);

    Leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        detectRetina: true,
        maxZoom: maxZoom,
        attribution: credit
      })
      .addTo(mapRef.current)

    // add marker for each locations found in database
    coordinates?.map((coor, idx) => {
      const marker = Leaflet
        .marker([coor.latitude, coor.longitude])
        .addTo(mapRef.current!);
    })

    removeAttribution();

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
    mapRef: mapRef, 
    markersRef: markersRef
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
function useAddMarker(props: UseAddMarkerProps) {
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