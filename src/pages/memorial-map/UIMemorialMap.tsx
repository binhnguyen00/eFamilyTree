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
  console.log(coordinates);
  
  const [ newMarker, setNewMarker ] = React.useState<Marker>();
  const [ removeMarker, setRemoveMarker ] = React.useState<Marker>();
  const [ selectedLocation, setSelectedLocation ] = React.useState<any>(null);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const { locations, loading } = useQueryMap({ dependencies: [ reload ]});

  const onAddMarker = (marker: Marker) => {
    console.log(marker);
    setNewMarker(marker);
  }

  const onRemoveMarker = (marker: Marker) => {
    console.log(marker);
    setRemoveMarker(marker);
    setReload(!reload);
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
            locations={locations}
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
function useQueryMap({ dependencies = [] }: { dependencies?: Array<any> }) {
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
  }, [ ...dependencies ]);

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