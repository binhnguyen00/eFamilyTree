import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { MemorialMapApi } from "api";
import { StyleUtils, ZmpSDK } from "utils";
import { useAppContext, useNotification, useRequestLocationContext } from "hooks";
import { 
  Header, Loading, CommonIcon,
  WorldMap, MapCoordinate, MapMarker, WorldMapConfig,
  MapTile, 
} from "components";

import { ServerResponse } from "types/server";

import { UILocation } from "./UILocation";
import { UICreateLocationForm } from "./UICreateLocation";
import { MapTerrainButtons } from "./buttons/UIMapTerrainButtons";
import { QuickCreateLocationButton } from "./buttons/UIQuickCreateButton";
import { Photo } from "pages/gallery/UIAlbumPhotos";

// ==============================
// Hooks
// ==============================
function useCurrentLocation() {
  const { needLocation, requestLocation } = useRequestLocationContext();
  const { loadingToast } = useNotification();

  const [ currentLocation, setLocation ] = React.useState<MapCoordinate | null>(null);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setLocation(null);

    if (needLocation) {
      requestLocation();
    } else {
      loadingToast({
        content: <p> {t("đang lấy toạ độ hiện tại...")} </p>,
        operation: (successToastCB, dangerToastCB, dismissToast) => {
          ZmpSDK.getLocation({
            successCB: (location) => {
              setLoading(false);
              setLocation({
                lat: parseFloat(location.latitude),
                lng: parseFloat(location.longitude)
              })
              dismissToast();
            },
            failCB: (error: any) => {
              dangerToastCB(t("không thành công"));
              setLoading(false);
              setError(true);
            }
          });
        }
      })
    }
  }, [ needLocation, reload ])

  return { currentLocation, error, loading, refresh }
}

export interface MemorialLocation extends MapMarker {
  clanId: number;
  memberId?: number;
  memberName?: string;
  photos?: Photo[];
}

function useMap() {
  const { userInfo } = useAppContext();  

  const [ markers, setMarkers ] = React.useState<MemorialLocation[]>([]);
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
          const data = result.data as any[];
          const locations = data.map((location) => {
            return {
              id:           location.id,
              name:         location.name,
              description:  location.description,
              coordinate: {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lng)
              },
              photoUrl:     location.images,
              memberId:     location.member_id,
              memberName:   location.member_name,
            } as MemorialLocation;
          })
          setMarkers(locations);
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

// ======================================
// UIMap
// ======================================
export function UIMap() {
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const { needLocation, requestLocation } = useRequestLocationContext();
  const { currentLocation, refresh: locateCurrentLocation } = useCurrentLocation();
  const { markers, loading, error, refresh: refreshMap } = useMap();

  const memoizedMarkers = React.useMemo(() => {
    return markers;
  }, [markers]);

  const [ mapTile, setMapTile ]         = React.useState<MapTile>({
    url: WorldMapConfig.defaultTileLayer,
    maxZoom: WorldMapConfig.defaultMaxZoom
  });

  const [ selected, setSelected ]       = React.useState<MemorialLocation | null>(null);
  const [ coordinate, setCoordinate ]   = React.useState<MapCoordinate | null>(null);

  const [ requestInfo, setRequestInfo ]     = React.useState<boolean>(false);
  const [ requestCreate, setRequestCreate ] = React.useState<boolean>(false);

  const onSelect = (marker: MapMarker) => {
    if (needLocation) {
      requestLocation();
      return;
    }
    loadingToast({
      content: <p> {t("đang chuẩn bị dữ liệu...")} </p>,
      operation: (successToastCB, dangerToastCB, dismissToast) => {
        MemorialMapApi.get({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: marker.id,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("lấy dữ liệu không thành công"))
            } else {
              const data = result.data as any;
              setSelected({
                id:           data.id,
                name:         data.name,
                description:  data.description,
                clanId:       data.clan_id,
                memberId:     data.member_id,
                memberName:   data.member_name,
                photos:       data.images,
                coordinate: {
                  lat: parseFloat(data.lat),
                  lng: parseFloat(data.lng)
                }
              });
              setRequestInfo(true);
              dismissToast();
            }
          },
          fail: () => dangerToastCB(t("lấy dữ liệu không thành công"))
        })
      }
    })
    setRequestInfo(true);
  }

  const onLocateCurrentLocation = () => {
    if (needLocation) { requestLocation(); return; }
    locateCurrentLocation();
  }

  const onQuickCreate = (coordinate: MapCoordinate) => {
    if (needLocation) { requestLocation(); return; }
    setCoordinate(coordinate)
    setRequestCreate(true);
  }

  const onSelectOnMap = (coordinate: MapCoordinate) => {
    if (needLocation) { requestLocation(); return; }
    setCoordinate(coordinate)
    setRequestCreate(true);
  }

  const onChangeMapTerrain = (terrain: MapTile) => setMapTile(terrain);

  const renderContainer = () => {
    if (loading) {
      return (
        <div className="bg-white">
          <Loading/>
        </div>
      )
    } else {
      return (
        <div>
          <UIMapController 
            className="p-2"
            onReloadParent={refreshMap}
            onQuickCreate={onQuickCreate}
            onChangeMapTerrain={onChangeMapTerrain}
            onCurrentPosition={onLocateCurrentLocation}
          />
          <WorldMap
            tileLayer={mapTile}
            height={StyleUtils.calComponentRemainingHeight(48)}
            markers={memoizedMarkers}
            currentMarker={currentLocation as MapCoordinate}
            onSelectMarker={onSelect}
            onSelectOnMap={onSelectOnMap}
          />
        </div>
      )
    }
  }

  return (
    <>
      <Header title={t("memorial_location")}/>

      <div className="container-padding bg-white">
        {renderContainer()}
      </div>

      <UILocation
        key={selected ? selected.id : "location-details"}
        data={selected}
        visible={requestInfo}
        onClose={() => setSelected(null)}
        onReloadParent={refreshMap}
      />

      <UICreateLocation
        key={coordinate ? coordinate.lat : "create-location"}
        coordinate={coordinate}
        visible={requestCreate}
        onClose={() => setRequestCreate(false)}
        onSuccess={(record: MemorialLocation) => {
          refreshMap();
          setRequestCreate(false);
        }}
      />
    </>
  )
}

interface UIMemorialMapControllerProps {
  onQuickCreate?: (coordinate: MapCoordinate) => void;
  onChangeMapTerrain?: (terrain: MapTile) => void;
  onCurrentPosition?: () => void;
  onReloadParent?: () => void;
  className?: string;
}
export function UIMapController(props: UIMemorialMapControllerProps) {
  const { onQuickCreate, onChangeMapTerrain, onReloadParent, onCurrentPosition, className } = props;

  return (
    <div className={`scroll-h ${className}`.trim()}>
      <div>
        <Button size="small" prefixIcon={<CommonIcon.CurrentPosition/>} onClick={onCurrentPosition}>
          {t("tôi")}
        </Button>
      </div>
      <MapTerrainButtons onSelect={onChangeMapTerrain}/>
      <QuickCreateLocationButton onCreate={onQuickCreate}/>
      <div>
        <Button size="small" onClick={onReloadParent} prefixIcon={<CommonIcon.Reload size={"1rem"}/>}>
          {t("tải lại")}
        </Button>
      </div>
    </div>
  )
}

interface UICreateLocationProps {
  visible: boolean;
  coordinate: MapCoordinate | null;
  onClose: () => void;
  onSuccess?: (record: MemorialLocation) => void;
}
export function UICreateLocation(props: UICreateLocationProps) {
  const { visible, coordinate, onClose, onSuccess } = props;
  if (coordinate === null) return null;

  return (
    <Sheet visible={visible} onClose={onClose} height={StyleUtils.calComponentRemainingHeight(0)}>
      <UICreateLocationForm onSuccess={onSuccess} coordinate={coordinate}/>
    </Sheet>
  )
}