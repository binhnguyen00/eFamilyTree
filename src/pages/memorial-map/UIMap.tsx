import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { MemorialMapApi } from "api";
import { DivUtils, ZmpSDK } from "utils";
import { ServerResponse, Photo } from "types";
import { useAppContext, useNotification, usePageContext, useRequestLocationContext } from "hooks";
import { Header, Loading, CommonIcon, WorldMap, MapCoordinate, MapMarker, WorldMapConfig, MapTile, Toolbar } from "components";

import { UILocation } from "./UILocation";
import { UICreateLocationForm } from "./UICreateLocation";

function useCurrentLocation() {
  const { needLocation, requestLocation } = useRequestLocationContext();
  const { loadingToast, warningToast } = useNotification();

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
        content: t("Tìm vị trí của bạn..."),
        operation: (successToastCB, dangerToastCB, dismissToast) => {
          const timeout = setTimeout(() => {
            warningToast(t("Không tìm thấy! Hãy thử lại"));
            setLoading(false);
            setError(true);
            dismissToast();
          }, 8000);

          ZmpSDK.getLocation({
            successCB: (location) => {
              clearTimeout(timeout);
              setLoading(false);
              setLocation({
                lat: parseFloat(location.latitude),
                lng: parseFloat(location.longitude)
              })
              dismissToast();
            },
            failCB: (error: any) => {
              clearTimeout(timeout);
              dangerToastCB(t("Không thành công"));
              setLoading(false);
              setError(true);
            }
          });
          return () => {
            if (timeout) clearTimeout(timeout);
          };
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

export function UIMap() {
  const { userInfo } = useAppContext();
  const { permissions } = usePageContext();
  const { loadingToast, warningToast } = useNotification();
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
      content: <p> {t("Chuẩn bị dữ liệu...")} </p>,
      operation: (successToastCB, dangerToastCB, dismissToast) => {
        MemorialMapApi.get({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: marker.id,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("Lấy dữ liệu không thành công"))
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
          fail: () => dangerToastCB(t("Lấy dữ liệu không thành công"))
        })
      }
    })
    setRequestInfo(true);
  }

  const onLocateCurrentLocation = () => {
    if (needLocation) { requestLocation(); return; }
    locateCurrentLocation();
  }

  const onSelectOnMap = (coordinate: MapCoordinate) => {
    if (needLocation) { 
      requestLocation(); 
      return; 
    }
    if (!permissions.canModerate) {
      warningToast(t("Bạn không có quyền tạo Di tích"));
      return;
    }
    setCoordinate(coordinate)
    setRequestCreate(true);
  }

  const onChangeMapTerrain = (terrain: MapTile) => setMapTile(terrain);

  const renderContainer = () => {
    if (loading) {
      return (
        <div className="container bg-white">
          <Loading/>
        </div>
      )
    } else {
      return (
        <div className="relative">
          {/* controller */}
          <Toolbar>
            <Button size="small" onClick={onLocateCurrentLocation} variant="secondary" className="box-shadow">
              <CommonIcon.MapPin size={"1.5rem"}/>
            </Button>
            <Button 
              size="small" variant="secondary" className="box-shadow"
              onClick={() => onChangeMapTerrain({
                url: WorldMapConfig.defaultTileLayer,
                maxZoom: WorldMapConfig.defaultMaxZoom
              })}
            >
              <CommonIcon.Map2 size={"1.5rem"}/>
            </Button>
            <Button 
              size="small" variant="secondary" className="box-shadow"
              onClick={() => onChangeMapTerrain({
                url: WorldMapConfig.satelliteTileLayer,
                maxZoom: WorldMapConfig.satelliteMaxZoom
              })} 
            >
              <CommonIcon.Terrain size={"1.5rem"}/>
            </Button>
            <Button size="small" onClick={refreshMap} variant="secondary" loading={loading} className="box-shadow">
              <CommonIcon.Reload size={"1.5rem"}/>
            </Button>
          </Toolbar>
          {/* map */}
          <WorldMap
            tileLayer={mapTile}
            height={"100vh"}
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

      <div className="bg-white">
        {renderContainer()}
      </div>

      <UILocation
        key={selected ? selected.id : "location-details"}
        data={selected} visible={requestInfo} permissions={permissions}
        onClose={() => setSelected(null)} onReloadParent={refreshMap}
      />

      <Sheet visible={requestCreate} onClose={() => setRequestCreate(false)} height={DivUtils.calculateHeight(0)}>
        <UICreateLocationForm 
          key={coordinate ? coordinate.lat : "create-location"} 
          coordinate={coordinate!}
          onSuccess={(record: MemorialLocation) => {
            refreshMap();
            setRequestCreate(false);
          }} 
        />
      </Sheet>
    </>
  )
}