import React from "react";
import Leaflet from "leaflet";
import { Coordinate } from "../WorldMap";

export function useMap(initLocation: Coordinate, zoom: number) {
  const mapRef = React.useRef<Leaflet.Map | null>(null);

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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initLocation, zoom]);

  return mapRef.current as Leaflet.Map;
}