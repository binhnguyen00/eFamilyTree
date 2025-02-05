import React from "react";
import { t } from "i18next";

import { StyleUtils, ZmpSDK } from "utils";
import { MemorialMapApi } from "api";
import { FailResponse, ServerResponse } from "types/server";
import { Header, WorldMap, useAppContext, Marker, Loading, Coordinate, WorldMapConfig, ScrollableDiv } from "components";

import { CreateButton } from "./CreateButton";
import { MapTypeButtons } from "./SelectMapTypeButton";
import { UIMemorialLocation } from "./UIMemorialLocation";
import { CurrentPositionButton } from "./CurrentPositionButton";


// ============================
// Map
// ============================
export function UIMemorialMap() {
  const { zaloUserInfo, logedIn } = useAppContext();
  const locationPermission = zaloUserInfo.authSettings?.["scope.userLocation"];

  const [ currentLoc, setCurrentLoc ] = React.useState<Coordinate>();

  const [ mapTile, setMapTile ] = React.useState<string>(WorldMapConfig.defaultTileLayer);
  const [ newMarker, setNewMarker ] = React.useState<Marker>();
  const [ removeMarker, setRemoveMarker ] = React.useState<Marker>();
  const [ selectedLocation, setSelectedLocation ] = React.useState<any>(null);

  React.useEffect(() => {
    if (locationPermission && logedIn) {
      const successLoc = (location: any) => {
        setCurrentLoc({
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude)
        })
      }
      const failLoc = (error: any) => { // could be user decline location access
      }
      ZmpSDK.getLocation(successLoc, failLoc);
    }
  }, [ zaloUserInfo ])

  const { locations, loading } = useQueryMap();

  const onAddMarker = (marker: Marker) => {
    setNewMarker(marker);
  }

  const onRemoveMarker = (marker: Marker) => {
    setRemoveMarker(marker);
  }

  const onSelectMapType = (type: string) => {
    setMapTile(type);
  }

  const onCurrentPosition = (coordinate: Coordinate) => {
    setCurrentLoc(coordinate);
  }

  if (loading) return <Loading/>

  return (
    <>
      <Header title={t("memorial_location")}/>

      <div className="container-padding max-h bg-white">
        <div className="flex-v flex-grow-0">
          <UIMemorialMapController 
            onAdd={onAddMarker}
            onSelectMapType={onSelectMapType}
            onCurrentPosition={onCurrentPosition}
          />
          <WorldMap
            tileLayer={mapTile}
            currentLocation={currentLoc}
            height={StyleUtils.calComponentRemainingHeight(45)}
            locations={locations}
            addMarker={newMarker}
            removeMarker={removeMarker}
            onMarkerClick={(location: any) => {
              console.log(location);
              setSelectedLocation(location);
            }}
          />
        </div>

        {selectedLocation && (
          <UIMemorialLocation
            id={selectedLocation.id}
            visible={selectedLocation !== null}
            onClose={() => setSelectedLocation(null)}
            onRemove={onRemoveMarker}
          />
        )}
      </div>
    </>
  )
}

// ============================
// Query
// ============================
function useQueryMap() {
  const { userInfo } = useAppContext();  
  const [ locations, setLocations ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "success") {
        setLocations(result.data);
      }
    }
    const fail = (res: FailResponse) => {
      setLoading(false);
    }
    MemorialMapApi.search({clan_id: userInfo.clanId}, success, fail);
  }, [ ]);

  return {
    loading: loading,
    locations: locations,
  }
}

// ============================
// Controller
// ============================
interface UIMemorialMapControllerProps {
  onAdd?: (marker: Marker) => void;
  onSelectMapType?: (type: string) => void;
  onCurrentPosition?: (coordinate: Coordinate) => void;
}
export function UIMemorialMapController(props: UIMemorialMapControllerProps) {
  const { onAdd, onSelectMapType, onCurrentPosition } = props;

  return (
    <ScrollableDiv 
      direction="horizontal"
      className="flex-h"
    >
      <CreateButton
        onAdd={onAdd} 
      />
      <CurrentPositionButton
        onClick={onCurrentPosition!}
      />
      <MapTypeButtons
        onSelect={onSelectMapType!}
      />
    </ScrollableDiv>
  )
}