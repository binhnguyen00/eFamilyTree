import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { MemorialMapApi } from "api";
import { useAppContext } from "hooks";
import { StyleUtils, ZmpSDK } from "utils";
import { ServerResponse } from "types/server";
import { Header, WorldMap, Marker, Loading, Coordinate, WorldMapConfig, Info, CommonIcon, RequestLocation } from "components";

import { UIMemorialLocation } from "./UILocation";
import { CreateButton } from "./buttons/UICreateButton";
import { MapTypeButtons } from "./buttons/UIMapTypeButton";
import { CurrentPositionButton } from "./buttons/UICurrentLocationButton";

function useCurrentLocation() {
  const { zaloUserInfo, logedIn } = useAppContext();
  const { "scope.userLocation": locationPermission } = zaloUserInfo.authSettings;

  const [ location, setLocation ] = React.useState<Coordinate | null>(null);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);
  const update = (location: Coordinate) => setLocation(location);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setLocation(null);

    if (locationPermission) {
      ZmpSDK.getLocation({
        successCB: (location) => {
          setLoading(false);
          setLocation({
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude)
          })
        },
        failCB: (error: any) => {
          setLoading(false);
          setError(true);
        }
      });
    } else {
      // request for location permission?
    }
  }, [ zaloUserInfo, logedIn ])

  return { location, error, loading, refresh, update }
}

function useMap() {
  const { userInfo } = useAppContext();  

  const [ markers, setMarkers ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setMarkers([]);

    MemorialMapApi.search({
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "success") {
          setMarkers(result.data);
        } else {
          setError(true);
        }
      }, 
      fail: () => {
        setLoading(false);
        setError(true);
      }
    });
  }, [ reload ]);

  return { markers, loading, error, refresh }
}

export function UIMap() {
  const { location, update } = useCurrentLocation();

  const [ mapTile, setMapTile ] = React.useState<string>(WorldMapConfig.defaultTileLayer);
  const [ newMarker, setNewMarker ] = React.useState<Marker>();
  const [ removeMarker, setRemoveMarker ] = React.useState<Marker>();
  const [ selectedMarker, setSelectedMarker ] = React.useState<any>(null);
  const [ requestLocation, setRequestLocation ] = React.useState(false);   

  const onAddMarker = (marker: Marker) => setNewMarker(marker);
  const onRemoveMarker = (marker: Marker) => setRemoveMarker(marker);
  const onSelectMapType = (type: string) => setMapTile(type);
  const onCurrentPosition = (coordinate: Coordinate) => update(coordinate);

  const { markers, loading, error, refresh } = useMap();

  const renderContainer = () => {
    if (loading) {
      return (
        <div className="max-h bg-white">
          <Loading/>
        </div>
      )
    } else {
      return (
        <div className="flex-v flex-grow-0">
          <UIMapController 
            onAdd={onAddMarker}
            onSelectMapType={onSelectMapType}
            onCurrentPosition={onCurrentPosition}
            onRequestLocation={() => setRequestLocation(true)}
          />
          <WorldMap
            tileLayer={mapTile}
            currentMarker={location}
            height={StyleUtils.calComponentRemainingHeight(45)}
            locations={markers}
            addMarker={newMarker}
            removeMarker={removeMarker}
            onMarkerClick={(location: any) => setSelectedMarker(location)}
          />
        </div>
      )
    }
  }


  return (
    <>
      <Header title={t("memorial_location")}/>

      <div className="container-padding max-h bg-white">
        {renderContainer()}
      </div>

      {selectedMarker && (
        <UIMemorialLocation
          id={selectedMarker.id}
          visible={selectedMarker !== null}
          onClose={() => setSelectedMarker(null)}
          onRemove={onRemoveMarker}
        />
      )}

      <RequestLocation
        visible={requestLocation}
        onClose={() => setRequestLocation(false)}
      />
    </>
  )
}

interface UIMemorialMapControllerProps {
  onAdd?: (marker: Marker) => void;
  onSelectMapType?: (type: string) => void;
  onCurrentPosition?: (coordinate: Coordinate) => void;
  onRequestLocation?: () => void;
}
export function UIMapController(props: UIMemorialMapControllerProps) {
  const { onAdd, onSelectMapType, onCurrentPosition } = props;

  return (
    <div className="scroll-h">
      <CreateButton
        onAdd={onAdd} 
      />
      <CurrentPositionButton
        onClick={onCurrentPosition!}
      />
      <MapTypeButtons
        onSelect={onSelectMapType!}
      />
    </div>
  )
}