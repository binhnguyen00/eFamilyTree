import React from "react";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/leaflet.scss"

import { useNotification } from "hooks";

import config from "./config";

export type Marker = {
  id: number;
  name: string;
  description?: string;
  coordinate: Coordinate;
  images: string[];
}

export type Coordinate = {
  lat: number;
  lng: number;
}

interface WorldMapProps {
  markers: Marker[];
  height?: string | number;
  tileLayer?: string;
  addMarker?: Marker;
  removeMarker?: Marker;
  currentMarker: Coordinate | null
  markerContent?: string | React.ReactNode;
  onSelectOnMap?: (coordinate: Coordinate) => void;
  onSelectMarker?: (marker: Marker) => void;
}

export function WorldMap(props: WorldMapProps) {
  const {  
    tileLayer, height, markers, addMarker, removeMarker, currentMarker, markerContent,
    onSelectMarker, onSelectOnMap } = props;

  const { mapRef, markersRef, icon } = useMap({ 
    tileLayer, markers, currentMarker, markerContent,
    onSelectMarker, onSelectOnMap,
  });

  useAddMarker({
    mapRef: mapRef,
    markersRef: markersRef,
    marker: addMarker,
    popupContent: "Di tích",
    onMarkerClick: onSelectMarker,
    icon: icon
  })

  useRemoveMarker({
    mapRef: mapRef,
    markersRef: markersRef,
    marker: removeMarker,
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
  markers: Marker[];
  currentMarker: Coordinate | null;
  tileLayer?: string;
  markerContent?: string | React.ReactNode;
  onCurrentLocation?: () => void;
  onSelectMarker?: (marker: Marker) => void;
  onSelectOnMap?: (coordinate: Coordinate) => void;
}
function useMap(props: UseMapProps) {
  const { markers, currentMarker, tileLayer, onSelectMarker, onSelectOnMap } = props;
  const { successToast, dangerToast } = useNotification();

  const mapRef = React.useRef<Leaflet.Map | null>(null);
  const markersRef = React.useRef<Leaflet.Marker[]>([]);
  const icon = Leaflet.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  })

  const removeLeafletLogo = () => {
    const attribution = document.querySelector('a[href="https://leafletjs.com"]');
    if (attribution) attribution.remove();
  }

  React.useEffect(() => {
    // create intance map
    mapRef.current = Leaflet
      .map("map")
      .setView([
        currentMarker?.lat || config.initLocation.latitude,
        currentMarker?.lng || config.initLocation.longitude
      ], config.initZoom, {
        animate: true,
        duration: 10
      });
      
    Leaflet
      .tileLayer(config.defaultTileLayer, {
        detectRetina: true,
        maxZoom: config.defaultMaxZoom,
      })
      .addTo(mapRef.current)

    // render markers
    markers.map((record, index) => {
      const marker = Leaflet.marker([record.coordinate.lat, record.coordinate.lng])
      marker
        .addTo(mapRef.current!)
        .setIcon(icon)
      markersRef.current.push(marker);
      if (onSelectMarker) {
        marker.on('click', () => {
          onSelectMarker(record);
        });
      }
    })
    
    // on select on map
    mapRef.current.on('click', (e: Leaflet.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (onSelectOnMap) onSelectOnMap({ lat, lng } as Coordinate);
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
  }, [ markers ]);

  // change map tile layer
  React.useEffect(() => {
    if (!tileLayer) {
      Leaflet
        .tileLayer(config.defaultTileLayer, {
          detectRetina: true,
          maxZoom: 20,
        })
        .addTo(mapRef.current!)
    } else if (tileLayer.startsWith("http://server.arcgisonline.com")) {
      Leaflet
        .tileLayer(config.satelliteTileLayer, {
          detectRetina: true,
          maxZoom: config.satelliteMaxZoom,
        })
        .addTo(mapRef.current!)
    } else {
      Leaflet
        .tileLayer(config.defaultTileLayer, {
          detectRetina: true,
          maxZoom: config.defaultMaxZoom,
        })
        .addTo(mapRef.current!)
    }
  }, [ tileLayer ])

  // go to current location
  React.useEffect(() => {
    if (currentMarker !== null) {
      const marker = Leaflet.marker([currentMarker.lat, currentMarker.lng])
        .addTo(mapRef.current!)
        .setIcon(icon)
      markersRef.current.push(marker);
      mapRef.current!.setView([
        currentMarker.lat,
        currentMarker.lng
      ], 17.5, { 
        animate: true,
        duration: 3
      });
    }
  }, [ currentMarker ])

  return { mapRef, markersRef, icon }
}

// ========================
// use Add Marker
// ========================
interface UseAddMarkerProps {
  mapRef: React.RefObject<Leaflet.Map>;
  markersRef: React.RefObject<Leaflet.Marker[]>;
  marker?: Marker;
  onMarkerClick?: (marker: Marker) => void;
  popupContent?: string | ((coordinate: Coordinate) => string);
  icon: any;
}
function useAddMarker(props: UseAddMarkerProps) {
  const { mapRef, markersRef, marker, onMarkerClick, popupContent, icon } = props;

  React.useEffect(() => {
    if (!mapRef.current || !markersRef.current || !marker) return;

    const newRecord = Leaflet
      .marker([marker.coordinate.lat, marker.coordinate.lng])
      .setIcon(icon)
      .addTo(mapRef.current);

    if (popupContent) {
      newRecord.bindPopup(
        typeof popupContent === 'function' 
          ? popupContent(marker.coordinate) 
          : popupContent
      )
    }

    if (onMarkerClick) {
      newRecord.on('click', () => onMarkerClick(marker));
    }

    // Store marker reference
    markersRef.current.push(newRecord);
    // Center map on new marker
    mapRef.current.setView([marker.coordinate.lat, marker.coordinate.lng], mapRef.current.getZoom());

  }, [ marker, onMarkerClick, popupContent ]);
}

// ========================
// use remove Marker
// ========================
interface UseRemoveMarkerProps {
  mapRef: React.RefObject<Leaflet.Map>;
  markersRef: React.RefObject<Leaflet.Marker[]>;
  marker?: Marker;
}
function useRemoveMarker(props: UseRemoveMarkerProps) {
  const { mapRef, markersRef, marker } = props;

  React.useEffect(() => {
    if (!mapRef.current || !markersRef.current || !marker) return;

    const index = markersRef.current.findIndex(
      (m) => {
        return (
          m.getLatLng().lat.toString() === marker.coordinate.lat.toString()
          && m.getLatLng().lng.toString() === marker.coordinate.lng.toString())
      }
    );

    if (index !== -1) {
      mapRef.current.removeLayer(markersRef.current[index]);
      markersRef.current.splice(index, 1);
      mapRef.current.setView([marker.coordinate.lat, marker.coordinate.lng], mapRef.current.getZoom());
    }
  }, [ marker ])
}