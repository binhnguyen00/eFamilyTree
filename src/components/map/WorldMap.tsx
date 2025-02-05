import React from "react";
import ReactDOM from 'react-dom/client';
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/leaflet.scss"

import config from "./config";

import { RequestLocation, SlidingPanel, SlidingPanelOrient, useAppContext } from "components";
import { CreateLocationForm } from "./CreateLocationForm";
import { useNotification } from "hooks";

export type Marker = {
  id: number;
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
  removeMarker?: Marker;
  onMarkerClick?: (location: any) => void;
  markerContent?: string | React.ReactNode;
  currentLocation?: Coordinate;
  tileLayer?: string;
}

export function WorldMap(props: WorldMapProps) {
  const { 
    height,
    locations,
    addMarker,
    removeMarker,
    currentLocation,
    tileLayer,
    onMarkerClick, markerContent,
  } = props;

  const { mapRef, markersRef, icon } = useMap({ 
    tileLayer: tileLayer,
    currentCoord: currentLocation,
    coordinates: locations,
    onMarkerClick: onMarkerClick, 
    markerContent: markerContent,
  });

  useAddMarker({
    mapRef: mapRef,
    markersRef: markersRef,
    marker: addMarker,
    popupContent: "Di tích",
    onMarkerClick: onMarkerClick,
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
  coordinates?: any[];
  currentCoord?: Coordinate;
  onMarkerClick?: (location: any) => void;
  markerContent?: string | React.ReactNode;
  tileLayer?: string;
}
function useMap(props: UseMapProps) {
  const { coordinates, onMarkerClick, currentCoord, tileLayer } = props;

  const { userInfo, zaloUserInfo, logedIn } = useAppContext();
  const { successToast, dangerToast } = useNotification();

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
      .setView([
        currentCoord?.lat || config.initLocation.latitude,
        currentCoord?.lng || config.initLocation.longitude
      ], config.initZoom, {
        animate: true,
        duration: 1500
      });
    Leaflet
      .tileLayer(config.defaultTileLayer, {
        detectRetina: true,
        maxZoom: config.maxZoom,
      })
      .addTo(mapRef.current)

    // add marker for each locations found in database
    coordinates?.map((loc, idx) => {
      const marker = Leaflet.marker([loc.lat, loc.lng])
      marker
        .addTo(mapRef.current!)
        .setIcon(icon)
      markersRef.current.push(marker);
      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick(loc);
        });
      }
    })

    // click on map handler
    mapRef.current.on('click', (e: Leaflet.LeafletMouseEvent) => {
      // Check Location Permission
      const locationPermission = zaloUserInfo.authSettings?.["scope.userLocation"];
      if (!locationPermission || !logedIn) {
        const popupContainer = document.createElement('div');
        const root = ReactDOM.createRoot(popupContainer);
        root.render(
          <RequestLocation
            visible={true}
            close={() => {
              setAddMarkerVisible(false);
              root.unmount();
            }}
          />
        )
      } else {
        const { lat, lng } = e.latlng;
        const popupContainer = document.createElement('div');

        const saveSuccess = (record: Marker) => {
          const marker = Leaflet.marker([record.coordinate.lat, record.coordinate.lng])
          marker
            .addTo(mapRef.current!)
            .setIcon(icon)

          if (onMarkerClick) {
            marker.on('click', () => {
              onMarkerClick(record);
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
              header={"Thêm Di tích tại điểm chọn"}      
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
                successToast={successToast}
                dangerToast={dangerToast}
              />
            </SlidingPanel>
          </div>
        ));
      }
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
  }, [ coordinates, currentCoord ]);

  // Change map tile layer
  React.useEffect(() => {
    Leaflet
      .tileLayer(tileLayer ? tileLayer : config.defaultTileLayer, {
        detectRetina: true,
        maxZoom: config.maxZoom,
      })
      .addTo(mapRef.current!)
  }, [ tileLayer ])

  // Go to current location
  React.useEffect(() => {
    if (currentCoord) {
      Leaflet
        .marker([currentCoord.lat, currentCoord.lng])
        .addTo(mapRef.current!)
        .setIcon(icon)
      mapRef.current!.setView([
        currentCoord.lat,
        currentCoord.lng
      ], 17.5, { 
        animate: true,
        duration: 1500
      });
    }
  }, [ currentCoord ])

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