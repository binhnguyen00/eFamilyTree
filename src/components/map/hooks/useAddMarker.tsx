import React from "react";
import Leaflet from "leaflet";

import { Coordinate } from "../WorldMap";

interface UseAddMarkerProps {
  map: Leaflet.Map;
  coordinate: Coordinate;
  onMarkerClick;
  popupContent;
}
export function useAddMarker(props: UseAddMarkerProps) {
  const { map, coordinate, onMarkerClick, popupContent } = props;

  const markersRef = React.useRef<Leaflet.Marker[]>([]);
  React.useEffect(() => {
    if (!map || !coordinate) return;

    // Create marker
    const marker = Leaflet
      .marker([coordinate.lat, coordinate.lng])
      .bindPopup(typeof popupContent === 'function' ? popupContent(coordinate) : popupContent)
      .addTo(map);

    // Add click handler
    if (onMarkerClick) {
      marker.on('click', () => onMarkerClick(coordinate));
    }

    // Store marker reference
    markersRef.current.push(marker);

    // Center map on new marker
    map.setView([coordinate.lat, coordinate.lng], map.getZoom());

    // Cleanup function
    return () => {
      marker.remove();
      markersRef.current = markersRef.current.filter(m => m !== marker);
    };
  }, [map, coordinate, onMarkerClick, popupContent]);
}