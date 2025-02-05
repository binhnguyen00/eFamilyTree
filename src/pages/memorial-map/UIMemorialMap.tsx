import React from "react";
import { t } from "i18next";

import { StyleUtils } from "utils";
import { MemorialMapApi } from "api";
import { FailResponse, ServerResponse } from "types/server";
import { Header, WorldMap, useAppContext, Marker, Loading } from "components";

import { CreateButton } from "./CreateButton";
import { UIMemorialLocation } from "./UIMemorialLocation";

import coordinates from "./data.json";

// ============================
// Map
// ============================
export function UIMemorialMap() {
  const [ newMarker, setNewMarker ] = React.useState<Marker>();
  const [ selectedLocation, setSelectedLocation ] = React.useState<any>(null);

  const { locations, loading } = useQueryMap();

  const onAddMarker = (marker: Marker) => {
    setNewMarker(marker);
  }

  if (loading) return <Loading/>

  return (
    <>
      <Header title={t("memorial_location")}/>

      <div className="container-padding max-h bg-white">
        <div className="flex-v flex-grow-0">
          <UIMemorialMapController onAdd={onAddMarker}/>
          <WorldMap
            height={StyleUtils.calComponentRemainingHeight(45)}
            locations={locations.length ? locations : new Array()}
            addMarker={newMarker}
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
  }, []);

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