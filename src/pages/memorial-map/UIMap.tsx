import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Sheet, Text } from "zmp-ui";

import { MemorialMapApi } from "api";
import { CommonUtils, StyleUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification, useRequestLocationContext } from "hooks";
import { 
  Header, WorldMap, Marker, Loading, Coordinate, 
  WorldMapConfig, CommonIcon, Label, SizedBox, BeanObserver } from "components";
import { ServerResponse } from "types/server";

import { UILocation } from "./UILocation";
import { MapTypeButtons } from "./buttons/UIMapTypeButton";
import { CurrentPositionButton } from "./buttons/UICurrentLocationButton";
import { QuickCreateLocationButton } from "./buttons/UIQuickCreateButton";

// ==============================
// Hooks
// ==============================
function useCurrentLocation() {
  const { needLocation, requestLocation } = useRequestLocationContext();

  const [ currentLocation, setLocation ] = React.useState<Coordinate | null>(null);
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
    }
  }, [ needLocation, reload ])

  return { currentLocation, error, loading, refresh }
}

export interface MemorialLocation extends Marker {
  memberId?: number;
  memberName?: string;
  clanId: number;
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
              id: location.id,
              name: location.name,
              description: location.description,
              coordinate: {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lng)
              },
              images: location.images,
              memberId: location.member_id,
              memberName: location.member_name,
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
  const { needLocation, requestLocation } = useRequestLocationContext();
  const { loadingToast } = useNotification();
  const { currentLocation, refresh: locateCurrentLocation } = useCurrentLocation();
  const { markers, loading, error, refresh: refreshMap } = useMap();

  const [ mapTile, setMapTile ] = React.useState<string>(WorldMapConfig.defaultTileLayer);
  const [ createMarker, setCreateMarker ] = React.useState<MemorialLocation | null>(null);
  const [ removeMarker, setRemoveMarker ] = React.useState<Marker | MemorialLocation | null>(null);
  const [ selectedMarker, setSelectedMarker ] = React.useState<MemorialLocation | null>(null);

  const [ requestCreate, setRequestCreate ] = React.useState<boolean>(false);
  const [ requestInfo, setRequestInfo ] = React.useState<boolean>(false);

  const onSelect = (marker: Marker) => {
    if (needLocation) {
      requestLocation();
      return;
    }
    loadingToast(
      <p> {t("đang chuẩn bị dữ liệu...")} </p>,
      (successToastCB, dangerToastCB) => {
        MemorialMapApi.get({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: marker.id,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("lấy dữ liệu không thành công"))
            } else {
              successToastCB(t("lấy dữ liệu thành công"))
              const data = result.data as any;
              setSelectedMarker({
                id:           data.id,
                name:         data.name,
                description:  data.description,
                clanId:       data.clan_id,
                memberId:     data.member_id,
                memberName:   data.member_name,
                images:       data.images,
                coordinate: {
                  lat: parseFloat(data.lat),
                  lng: parseFloat(data.lng)
                }
              });
              setRequestInfo(true);
            }
          },
          fail: () => dangerToastCB(t("lấy dữ liệu không thành công"))
        })

      }
    )
    setRequestInfo(true);
  }

  const onLocateCurrentLocation = () => {
    if (needLocation) {
      requestLocation();
      return;
    }
    locateCurrentLocation();
  }

  const onCreate = (marker: Marker) => {
    if (needLocation) {
      requestLocation();
      return;
    }
    setCreateMarker({
      id: marker.id,
      name: marker.name,
      clanId: userInfo.clanId,
      description: marker.description,
      coordinate: marker.coordinate,
      images: marker.images,
      memberId: 0,
      memberName: "",
    });
    setRequestCreate(true);
  };

  const onSelectOnMap = (coordinate: Coordinate) => {
    if (needLocation) {
      requestLocation();
      return;
    }
    setCreateMarker({
      id: 0,
      name: "",
      description: "",
      images: [],
      coordinate: coordinate,
      clanId: userInfo.clanId,
      memberId: 0,
      memberName: "",
    });
    setRequestCreate(true);
  }

  const onRemoveMarker = (marker: Marker) => setRemoveMarker(marker);
  const onSelectMapType = (type: string) => setMapTile(type);

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
            onRefresh={refreshMap}
            onCreate={onCreate}
            onSelectMapType={onSelectMapType}
            onCurrentPosition={onLocateCurrentLocation}
          />
          <WorldMap
            tileLayer={mapTile}
            height={StyleUtils.calComponentRemainingHeight(45)}
            markers={markers}
            addMarker={createMarker as Marker}
            removeMarker={removeMarker as Marker}
            currentMarker={currentLocation as Coordinate}
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

      <div className="container-padding max-h bg-white">
        {renderContainer()}
      </div>

      <UILocation
        data={selectedMarker}
        visible={requestInfo}
        onClose={() => setSelectedMarker(null)}
        onRemove={onRemoveMarker}
      />

      <UICreateLocation
        key={createMarker?.coordinate.lat}
        data={createMarker}
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

// ======================================
// Map Controller
// ======================================
interface UIMemorialMapControllerProps {
  onCreate?: (marker: Marker) => void;
  onSelectMapType?: (type: string) => void;
  onCurrentPosition?: () => void;
  onRefresh?: () => void;
}
export function UIMapController(props: UIMemorialMapControllerProps) {
  const { onCreate, onSelectMapType, onCurrentPosition, onRefresh } = props;

  return (
    <div className="scroll-h px-2">
      <div>
        <Button size="small" onClick={onRefresh} prefixIcon={<CommonIcon.Reload size={"1rem"}/>}>
          {t("tải lại")}
        </Button>
      </div>
      <QuickCreateLocationButton
        onSuccessCreate={onCreate} 
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

interface UICreateLocationProps {
  visible: boolean;
  data: MemorialLocation | null;
  onClose: () => void;
  onSuccess?: (record: MemorialLocation) => void;
}
export function UICreateLocation(props: UICreateLocationProps) {
  const { visible, data, onClose, onSuccess } = props;
  if (data === null) return null;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
    >
      <UICreateLocationForm onSuccess={onSuccess} data={data}/>
    </Sheet>
  )
}

// ======================================
// Create Form
// ======================================
interface UICreateLocationFormProps {
  data: MemorialLocation;
  onSuccess?: (record: MemorialLocation) => void;
}
function UICreateLocationForm(props: UICreateLocationFormProps) {
  const { data, onSuccess } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const observer = useBeanObserver(data as MemorialLocation)

  const blobUrlsToBase64 = async () => {
    const base64Promises = observer.getBean().images.map((blobUrl) => {
      return new Promise<string>((resolve) => {
        CommonUtils.blobUrlToBase64(blobUrl, (base64: string) => {
          resolve(base64);
        });
      });
    });
    const base64Array = await Promise.all(base64Promises);
    return base64Array;
  };

  const onCreate = async () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    const imgBase64s = await blobUrlsToBase64();
    loadingToast(
      <p> {t("đang xử lý...")} </p>,
      (successToastCB, dangerToastCB) => {
        MemorialMapApi.create({
          record: {
            id: observer.getBean().id,
            clanId: userInfo.clanId,
            name: observer.getBean().name,
            description: observer.getBean().description,
            coordinate: observer.getBean().coordinate,
            images: imgBase64s,
          },
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("tạo không thành công"));
            } else {
              successToastCB(t("tạo thành công"));
              const record = result.data;
              if (onSuccess) onSuccess({
                id: record.id,
                name: record.name,
                description: record.description,
                images: record.images,
                coordinate: {
                  lat: parseFloat(record.lat),
                  lng: parseFloat(record.lng)
                },
                clanId: record["clan_id"],
                memberId: record["member_id"],
                memberName: record["member_name"],
              } as MemorialLocation);
            }
          },
          fail: () => dangerToastCB(t("tạo không thành công"))
        });
      }
    )
  }

  return (
    <div className="scroll-v p-3">
      <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>

      <Input 
        label={<Label text="Tên Di Tích" required/>}
        value={observer.getBean().name} name="name"
        onChange={observer.watch}
      />

      <Input.TextArea
        size="large" label={<Label text="Mô Tả"/>}
        value={observer.getBean().description} name="description"
        onChange={(e) => observer.update("description", e.target.value)}
      />

      <ImageSelector observer={observer}/>

      <div className="flex-v">
        <Text.Title className="text-capitalize text-primary py-2"> {t("hành động")} </Text.Title>
        <div>
          <Button variant="primary" size="small" onClick={onCreate} prefixIcon={<CommonIcon.Save/>}>
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ImageSelectorProps {
  observer: BeanObserver<MemorialLocation>;
}
function ImageSelector({ observer }: ImageSelectorProps) {
  const [ imagePaths, setImagePaths ] = React.useState<string[]>([]);
  const { loadingToast, dangerToast } = useNotification();

  const onRemove = (index: number) => {
    const remains = imagePaths.filter((img, i) => i !== index);
    setImagePaths(remains);
    observer.update("images", remains);
  }

  const renderImages = () => {
    const images: React.ReactNode[] = React.useMemo(() => {
      return imagePaths.map((image, index) => {
        return (
          <SizedBox 
            className="button" key={index}
            width={100} height={100}
          >
            <img src={image} onClick={() => onRemove(index)}/>
          </SizedBox>
        )
      })
    }, [ imagePaths ])
    return images;
  }

  const chooseImage = () => {
    const success = (files: any[]) => {
      if (imagePaths.length + files.length > 5) {
        dangerToast(t("chọn tối đa 5 ảnh1"));
        return;
      }
      const blobs: string[] = [
        ...imagePaths,
        ...files.map(file => file.path)
      ];
      setImagePaths(blobs);
      observer.update("images", blobs);
    }
    const fail = () => dangerToast(t("chọn tối đa 5 ảnh1"));
    ZmpSDK.chooseImage(5, success, fail);
  }

  return (
    <div className="flex-v flex-grow-0">
      <label> {t("Ảnh (Tối đa 5 ảnh)")} </label>

      <Grid columnCount={3} rowSpace="0.5rem" columnSpace="0.5rem">
        {renderImages()}

        {imagePaths.length < 5 && (
          <SizedBox 
            className="button"
            width={100} height={100}
            onClick={chooseImage}
          >
            <CommonIcon.Plus/> {t("add")}
          </SizedBox>
        )}
      </Grid>
    </div>
  )
}