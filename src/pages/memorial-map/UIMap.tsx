import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Sheet, Text } from "zmp-ui";

import { MemorialMapApi } from "api";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { CommonUtils, StyleUtils, ZmpSDK } from "utils";
import { ServerResponse } from "types/server";
import { Header, WorldMap, Marker, Loading, Coordinate, WorldMapConfig, Info, CommonIcon, RequestLocation, Label, SizedBox, BeanObserver } from "components";

import { UILocation } from "./UILocation";
import { CreateButton } from "./buttons/UICreateButton";
import { MapTypeButtons } from "./buttons/UIMapTypeButton";
import { CurrentPositionButton } from "./buttons/UICurrentLocationButton";

function useCurrentLocation() {
  const { zaloUserInfo, logedIn } = useAppContext();
  const { "scope.userLocation": locationPermission } = zaloUserInfo.authSettings;

  const [ currentLocation, setLocation ] = React.useState<Coordinate | null>(null);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);
  const update = (location: Coordinate) => setLocation(location);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setLocation(null);

    if (locationPermission) {
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
    } else {
      // request for location permission?
    }
  }, [ zaloUserInfo, logedIn ])

  return { currentLocation, error, loading, refresh, update }
}

export interface MemorialLocation extends Marker {
  memberId?: string;
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

export function UIMap() {
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const { currentLocation, update } = useCurrentLocation();

  const [ mapTile, setMapTile ] = React.useState<string>(WorldMapConfig.defaultTileLayer);
  const [ createMarker, setCreateMarker ] = React.useState<Marker>();
  const [ removeMarker, setRemoveMarker ] = React.useState<Marker>();
  const [ requestLocation, setRequestLocation ] = React.useState(false);
  const [ selectedMarker, setSelectedMarker ] = React.useState<MemorialLocation | null>(null);

  const [ requestCreate, setRequestCreate ] = React.useState<boolean>(false);
  const [ requestInfo, setRequestInfo ] = React.useState<boolean>(false);

  const onSelect = (marker: Marker) => {
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

  const onCreate = (marker: Marker) => {
    setRequestCreate(true);
    setCreateMarker(marker);
  };

  const onSelectOnMap = (coordinate: Coordinate) => {
    setRequestCreate(true);
    setCreateMarker({
      id: 0,
      name: "",
      images: [],
      coordinate: coordinate,
    });
  }

  const onRemoveMarker = (marker: Marker) => setRemoveMarker(marker);
  const onSelectMapType = (type: string) => setMapTile(type);
  const onCurrentPosition = (coordinate: Coordinate) => update(coordinate);

  const { markers, loading, error, refresh } = useMap();

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
            onAdd={onCreate}
            onSelectMapType={onSelectMapType}
            onCurrentPosition={onCurrentPosition}
            onRequestLocation={() => setRequestLocation(true)}
          />
          <WorldMap
            tileLayer={mapTile}
            height={StyleUtils.calComponentRemainingHeight(45)}
            markers={markers}
            addMarker={createMarker}
            currentMarker={currentLocation}
            removeMarker={removeMarker}
            onSelectMarker={onSelect}
            onSelectOnMap={onSelectOnMap}
            onRequestLocation={() => setRequestLocation(true)}
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
        visible={requestCreate}
        onClose={() => setRequestCreate(false)}
        coordinate={createMarker ? createMarker.coordinate : { lat: 0, lng: 0 }}
        onSuccess={(record: MemorialLocation) => {
          refresh();
        }}
      />

      <RequestLocation
        visible={requestLocation}
        onClose={() => setRequestLocation(false)}
      />
    </>
  )
}

interface UIMemorialMapControllerProps {
  onAdd?: (marker: Marker) => void;
  onSelectMapType?: (type: string) => void;
  onCurrentPosition?: (coordinate: Coordinate) => void;
  onRequestLocation?: () => void;
}
export function UIMapController(props: UIMemorialMapControllerProps) {
  const { onAdd, onSelectMapType, onCurrentPosition, onRequestLocation } = props;

  return (
    <div className="scroll-h">
      <CreateButton
        onAdd={onAdd} 
      />
      <CurrentPositionButton
        onRequestLocation={onRequestLocation}
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
  coordinate: Coordinate;
  onClose: () => void;
  onSuccess?: (record: MemorialLocation) => void;
}
export function UICreateLocation(props: UICreateLocationProps) {
  const { visible, coordinate, onClose, onSuccess } = props;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
    >
      <UICreateLocationForm onSuccess={onSuccess} coordinate={coordinate}/>
    </Sheet>
  )
}

interface UICreateLocationFormProps {
  coordinate: Coordinate;
  onSuccess?: (record: MemorialLocation) => void;
}
function UICreateLocationForm(props: UICreateLocationFormProps) {
  const { coordinate, onSuccess } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const observer = useBeanObserver({
    id: 0,
    name: "",
    description: "",
    images: [],
    coordinate: coordinate,
    clanId: userInfo.clanId,
  } as MemorialLocation)

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
          fail: () => {
            dangerToastCB(t("tạo không thành công"));
          }
        });
      }
    )
  }

  return (
    <div className="flex-v">
      <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>

      <Input 
        size="small" label={<Label text="Tên Di Tích" required/>}
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
        <Text.Title className="text-capitalize text-primary py-2"> {t("utilities")} </Text.Title>
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