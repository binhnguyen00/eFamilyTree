import React from "react";
import { t } from "i18next";

import { Header, WorldMap, Coordinate, useAppContext, SlidingPanel, SlidingPanelOrient } from "components";

import { UIMemorialMapController } from "./UIMemorialMapController";
import { ServerResponse } from "types/server";
import { MemorialMapApi } from "api/MemorialMapApi";

export function UIMemorialMap() {
  const [ newMarker, setNewMarker ] = React.useState<Coordinate>();
  const [ addMarkerVisible, setAddMarkerVisible ] = React.useState(false);

  const { locations } = useMap();

  const onAddMarker = (coor: Coordinate) => {
    setAddMarkerVisible(true);
  }

  return (
    <div className="container">
      <Header title={t("memorial_location")}/>
      
      <div className="flex-v">
        <UIMemorialMapController onAdd={onAddMarker}/>
        <WorldMap
          locations={locations}
          addMarker={newMarker}
        />
      </div>

      <SlidingPanel 
        orient={SlidingPanelOrient.LeftToRight} 
        visible={addMarkerVisible} 
        header={"Thêm toạ độ mới"}      
        close={() => setAddMarkerVisible(false)}
      >
        <UICreateMarker/>
      </SlidingPanel>
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

function UICreateMarker() {

  return (
    <div className="flex-v">

    </div>
  )
}