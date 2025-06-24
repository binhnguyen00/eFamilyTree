import React from "react";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/leaflet.scss"

import config from "./config";

import { MapCoordinate, MapMarker, MemorialLocation } from "types";

interface WorldMapProps {
  markers: MemorialLocation[];
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
      id="map"
      style={{
        height: height,
        width: "100%",
      }}
    />
  );
}

interface UseMapProps {
  markers: MemorialLocation[];
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
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })
  const deadIcon = Leaflet.divIcon({
    html: `<div style="font-size: 1.2rem;"> 🪦 </div>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  })

  const removeLeafletLogo = () => {
    const attribution = document.querySelector('a[href="https://leafletjs.com"]');
    if (attribution) attribution.remove();
  }

  const removeLeafletController = () => {
    const attribution = document.getElementsByClassName("leaflet-control-container")[0];
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
      marker.addTo(mapRef.current!)
      if (record.memberId) {
        marker.setIcon(deadIcon)
      } else marker.setIcon(icon)

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
    removeLeafletController();

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
        tileSize: 256,
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