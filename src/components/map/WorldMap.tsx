import React from "react";
import ReactDOM from 'react-dom/client';
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/leaflet.scss"

import config from "./config";

import { SlidingPanel, SlidingPanelOrient, useAppContext } from "components";
import { CreateLocationForm } from "./CreateLocationForm";

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
  markerContent?: string | React.ReactNode;
}

export function WorldMap(props: WorldMapProps) {
  const { 
    height,
    locations,
    addMarker,
    onMarkerClick, markerContent,
  } = props;

  const { mapRef, markersRef, icon } = useMap({ 
    coordinates: locations,
    onMarkerClick: onMarkerClick, markerContent: markerContent,
  });

  useAddMarker({
    mapRef: mapRef,
    markersRef: markersRef,
    marker: addMarker,
    popupContent: "Toạ Độ",
    onMarkerClick: onMarkerClick,
    icon: icon
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
  markerContent?: string | React.ReactNode;
}
function useMap(props: UseMapProps) {
  const { coordinates, onMarkerClick } = props;
  const { userInfo } = useAppContext();
  const [ addMarkerVisible, setAddMarkerVisible ] = React.useState(true);

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
        .setIcon(icon)
        .bindPopup(`
          <div>
            <h3>Coordinates</h3>
            <p>Lat: ${coor.latitude}</p>
            <p>Lng: ${coor.longitude}</p>
          </div>
        `);
      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick({
            lat: coor.latitude, // Convert to Coordinate interface format
            lng: coor.longitude
          });
        });
      }
    })

    // click on map handler
    mapRef.current.on('click', (e: Leaflet.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const popupContainer = document.createElement('div');

      const saveSuccess = (record: Marker) => {
        const marker = Leaflet.marker([record.coordinate.lat, record.coordinate.lng])
        marker
          .addTo(mapRef.current!)
          .setIcon(icon)
          .bindPopup(`
            <div>
              <h3>Coordinates</h3>
              <p>Lat: ${record.coordinate.lat}</p>
              <p>Lng: ${record.coordinate.lng}</p>
            </div>
          `)
        if (onMarkerClick) {
          marker.on('click', () => {
            onMarkerClick({
              lat: record.coordinate.lat, // Convert to Coordinate interface format
              lng: record.coordinate.lng
            });
          });
        }

        setAddMarkerVisible(false);
        root.unmount();
      }

      const root = ReactDOM.createRoot(popupContainer);
      root.render((
        <div className="flex-v">
          <SlidingPanel
            className="bg-white"
            orient={SlidingPanelOrient.LeftToRight} 
            visible={addMarkerVisible} 
            header={"Thêm toạ độ mới"}      
            close={() => {
              setAddMarkerVisible(false);
              root.unmount();
            }}
          >
            <CreateLocationForm 
              lat={lat.toString()}
              lng={lng.toString()}
              clanId={userInfo.clanId}
              saveSuccess={saveSuccess}
            />
          </SlidingPanel>
        </div>
      ));
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
    markersRef: markersRef,
    icon: icon
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
      newRecord.bindPopup(`
        <div>
          <h3>Coordinates</h3>
          <p>Lat: ${marker.coordinate.lat}</p>
          <p>Lng: ${marker.coordinate.lng}</p>
        </div>
      `);
    }

    // Store marker reference
    markersRef.current.push(newRecord);
    // Center map on new marker
    mapRef.current.setView([marker.coordinate.lat, marker.coordinate.lng], mapRef.current.getZoom());

  }, [ marker, onMarkerClick, popupContent ]);
}