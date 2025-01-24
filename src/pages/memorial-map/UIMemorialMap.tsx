import React from "react";
import { t } from "i18next";

import { StyleUtils } from "utils";
import { MemorialMapApi } from "api/MemorialMapApi";
import { Header, WorldMap, Coordinate, useAppContext, Marker } from "components";

import { ServerResponse } from "types/server";

import { UIMemorialMapController } from "./UIMemorialMapController";

import coordinates from "./data.json";

export function UIMemorialMap() {
  const [ newMarker, setNewMarker ] = React.useState<Marker>();

  const { locations } = useMap();

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

function useMap() {
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