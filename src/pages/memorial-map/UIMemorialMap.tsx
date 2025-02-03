import React from "react";
import { t } from "i18next";

import { StyleUtils } from "utils";
import { MemorialMapApi } from "api";
import { Header, WorldMap, Coordinate, useAppContext, Marker } from "components";
import { ServerResponse } from "types/server";

import { CreateButton } from "./CreateButton";

import coordinates from "./data.json";

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
    const params = {
      clan_id: userInfo.clanId
    }
    MemorialMapApi.search(params, success);
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

  return (
    <div className="scroll-h px-1">
      <CreateButton
        onAdd={onAdd} 
      />
    </div>
  )
}