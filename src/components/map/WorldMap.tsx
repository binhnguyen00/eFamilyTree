import React from "react";
import ReactDOM from 'react-dom/client';
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

import config from "./config";

export type Marker = {
  label: string;
  description?: string;
  coordinate: Coordinate;
  images: string[]; // public paths
}

export type Coordinate = {
  lat: number;
  lng: number;
}

interface WorldMapProps {
  height?: string | number;
  locations?: any[];
  addMarker?: Marker;
  onMarkerClick?: (coordinate: Coordinate) => void;
}

export function WorldMap(props: WorldMapProps) {
  const { 
    height,
    locations,
    addMarker,
    onMarkerClick,
  } = props;

  const { mapRef, markersRef } = useMap({ 
    coordinates: locations,
    onMarkerClick: onMarkerClick
  });

  useAddMarker({
    mapRef: mapRef,
    markersRef: markersRef,
    marker: addMarker,
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
  onMarkerClick?: (coordinate: Coordinate) => void;
}
function useMap(props: UseMapProps) {
  const { coordinates, onMarkerClick } = props;

  const mapRef = React.useRef<Leaflet.Map | null>(null);
  const markersRef = React.useRef<Leaflet.Marker[]>([]);
  const popup = Leaflet.popup();

  const removeLeafletLogo = () => {
    const attribution = document.querySelector('a[href="https://leafletjs.com"]');
    if (attribution) attribution.remove();
  }

  React.useEffect(() => {
    // init map
    mapRef.current = Leaflet
      .map("map")
      .setView([config.initLocation.latitude, config.initLocation.longitude], config.initZoom);
    Leaflet
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        detectRetina: true,
        maxZoom: config.maxZoom,
        attribution: config.credit
      })
      .addTo(mapRef.current)

    // add marker for each locations found in database
    coordinates?.map((coor, idx) => {
      const marker = Leaflet.marker([coor.latitude, coor.longitude])
      marker
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="custom-popup">
            <h3>Coordinates</h3>
            <p>Lat: ${coor.latitude}</p>
            <p>Lng: ${coor.longitude}</p>
          </div>
        `);
      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick({
            lat: coor.latitude,  // Convert to Coordinate interface format
            lng: coor.longitude
          });
        });
      }
    })

    // click on map handler
    mapRef.current.on('click', (e: Leaflet.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const popupContainer = document.createElement('div');
      const root = ReactDOM.createRoot(popupContainer);
      root.render(
        <>
          <p>{e.latlng.toString()}</p>
          <button 
            className="add-marker-btn"
            onClick={() => {
              console.log('Add button clicked', e.latlng);
            }}
          >
            Click
          </button>
        </>
      );
    
      popup
        .setContent(popupContainer)
        .setLatLng(e.latlng)
        .openOn(mapRef.current!);
    });

    removeLeafletLogo();

    // prevent memory leak
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [ coordinates ]);

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
  marker?: Marker;
  onMarkerClick?: (coordinate: Coordinate) => void;
  popupContent?: string | ((coordinate: Coordinate) => string);
}
function useAddMarker(props: UseAddMarkerProps) {
  const { mapRef, markersRef, marker, onMarkerClick, popupContent } = props;

  React.useEffect(() => {
    if (!mapRef.current || !markersRef.current || !marker) return;

    const newRecord = Leaflet
      .marker([marker.coordinate.lat, marker.coordinate.lng])
      .addTo(mapRef.current);

    if (popupContent) {
      newRecord.bindPopup(
        typeof popupContent === 'function' 
          ? popupContent(marker.coordinate) 
          : popupContent
      )
    }

    if (onMarkerClick) {
      // marker.on('click', () => onMarkerClick(coordinate));
      newRecord.bindPopup(""+newRecord);
    }

    // Store marker reference
    markersRef.current.push(newRecord);
    // Center map on new marker
    mapRef.current.setView([marker.coordinate.lat, marker.coordinate.lng], mapRef.current.getZoom());

  }, [ marker, onMarkerClick, popupContent ]);
}