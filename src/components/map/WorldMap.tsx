import React from "react";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/leaflet.scss"

import config from "./config";

export type MapTile = {
  url: string;
  maxZoom: number;
}

export type MapMarker = {
  id: number;
  name: string;
  description?: string;
  coordinate: MapCoordinate;
  images: string[];
}

export type MapCoordinate = {
  lat: number;
  lng: number;
}

interface WorldMapProps {
  markers: MapMarker[];
  height?: string | number;
  tileLayer: {
    url: string;
    maxZoom: number;
  };
  currentMarker: MapCoordinate | null  
  markerContent?: string | React.ReactNode;
  onSelectOnMap?: (coordinate: MapCoordinate) => void;
  onSelectMarker?: (marker: MapMarker) => void;
}

export function WorldMap(props: WorldMapProps) {
  const {  
    tileLayer, height, markers, currentMarker, markerContent,
    onSelectMarker, onSelectOnMap 
  } = props;

  const { mapRef, markersRef, icon } = useMap({ 
    tileLayer, 
    markers, 
    currentMarker, 
    markerContent,
    onSelectMarker, 
    onSelectOnMap,
  });

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

interface UseMapProps {
  markers: MapMarker[];
  currentMarker: MapCoordinate | null;
  tileLayer: {
    url: string;
    maxZoom: number;
  };
  markerContent?: string | React.ReactNode;
  onCurrentLocation?: () => void;
  onSelectMarker?: (marker: MapMarker) => void;
  onSelectOnMap?: (coordinate: MapCoordinate) => void;
}
function useMap(props: UseMapProps) {
  const { markers, currentMarker, tileLayer, onSelectMarker, onSelectOnMap } = props;

  const mapRef = React.useRef<Leaflet.Map | null>(null);
  const markersRef = React.useRef<Leaflet.Marker[]>([]);
  const icon = Leaflet.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const removeLeafletLogo = () => {
    const attribution = document.querySelector('a[href="https://leafletjs.com"]');
    if (attribution) attribution.remove();
  }

  // create intance map
  React.useEffect(() => {
    mapRef.current = Leaflet.map("map")
      .setView([
        currentMarker ? currentMarker.lat : config.initLocation.latitude,
        currentMarker ? currentMarker.lng : config.initLocation.longitude
      ], config.initZoom, {
        animate: true,
        duration: 3,
        easeLinearity: 1,
      });
      
    Leaflet
      .tileLayer(tileLayer.url, {
        detectRetina: true,
        crossOrigin: true,
        maxZoom: tileLayer.maxZoom,
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
      if (onSelectOnMap) onSelectOnMap({ lat, lng } as MapCoordinate);
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
    Leaflet
      .tileLayer(tileLayer.url, {
        crossOrigin: true,
        detectRetina: true,
        maxZoom: tileLayer.maxZoom,
      })
      .addTo(mapRef.current!)
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