import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { StyleUtils } from "utils";
import { MemorialMapApi } from "api";
import { Header, WorldMap, Coordinate, useAppContext, Marker } from "components";
import { ServerResponse } from "types/server";

import { CreateButton } from "./CreateButton";

import coordinates from "./data.json";
import newMarkers from "./new-marker.json";

// ============================
// Map
// ============================
export function UIMemorialMap() {
  const [ newMarker, setNewMarker ] = React.useState<Marker>();

  const { locations } = useQueryMap();

  const onAddMarker = (marker: Marker) => {
    setNewMarker(marker);
  }

  return (
    <div className="container-padding">
      <Header title={t("memorial_location")}/>
      
      <div className="flex-v py-2">
        <UIMemorialMapController onAdd={onAddMarker}/>
        <WorldMap
          height={StyleUtils.calComponentRemainingHeight(50)}
          locations={coordinates}
          addMarker={newMarker}
          onMarkerClick={(coor: Coordinate) => {
            console.log(coor);
          }}
        />
      </div>
    </div>
  )
}

// ============================
// Query
// ============================
function useQueryMap() {
  const { userInfo } = useAppContext();  
  const [ locations, setLocations ] = React.useState<any[]>([]);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        setLocations(result.data);
      }
    }
    MemorialMapApi.search({clan_id: userInfo.clanId}, success);
  }, []);

  return {
    locations: locations
  }
}

// ============================
// Controller
// ============================
interface UIMemorialMapControllerProps {
  onAdd?: (marker: Marker) => void;
}
export function UIMemorialMapController(props: UIMemorialMapControllerProps) {
  const { onAdd } = props;

  const randomlyAddMarker = () => {
    const randomIndex = Math.floor(Math.random() * newMarkers.length);
    const randomMarker = newMarkers[randomIndex];
    onAdd?.({
      label: "test marker",
      coordinate: {
        lat: parseFloat(randomMarker.latitude),
        lng: parseFloat(randomMarker.longitude)
      },
      images: []
    });
  }

  return (
    <div className="scroll-h px-1">
      <CreateButton
        onAdd={onAdd} 
      />

      <Button
        variant="secondary" size="small"
        onClick={randomlyAddMarker}
      >
        {t("Thêm Dummy")}
      </Button>
    </div>
  )
}