import React from "react";
import { t } from "i18next";
import { Button, Grid, Input } from "zmp-ui";

import { MemorialMapApi } from "api";
import { CommonUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Marker, RequestLocation, SizedBox, SlidingPanel, SlidingPanelOrient } from "components";

import { ServerResponse } from "types/server";

interface CreateButtonProps {
  onAdd?: (marker: Marker) => void;
}
export function CreateButton({ onAdd }: CreateButtonProps) {
  const { logedIn, zaloUserInfo, userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const [ requestLoc, setRequestLoc ] = React.useState(false); 
  const [ addMarkerVisible, setAddMarkerVisible ] = React.useState(false);

  const onAddMarker = () => {
    const locationPermission = zaloUserInfo.authSettings?.["scope.userLocation"];
    if (!locationPermission || !logedIn) {
      setRequestLoc(true);
    } else {
      if (onAdd) {
        setAddMarkerVisible(true);
      }
    }
    // Debug
    // if (onAdd) {
    //   setAddMarkerVisible(true);
    // }
  }

  const onSave = (record: NewMarker | any) => {
    console.log(record);
    
    if (!record) {
      dangerToast(`${t("save")} ${t("fail")}`)
      return;
    };
    if (!record.name) {
      dangerToast("Nhập đủ thông tin")
      return;
    };
    const saveSuccess = (result: ServerResponse) => {
      if (!onAdd) return;
      if (result.status !== "error") {
        onAdd({
          label: record.name,
          description: record.description,
          images: record.images,
          coordinate: {
            lat: parseFloat(record.lat),
            lng: parseFloat(record.lng)
          }
        });
        successToast(`${t("save")} ${t("success")}`);
      } else saveFail(null);
    }
    const saveFail = (error: any) => {
      dangerToast(`${t("save")} ${t("fail")}`)
    }
    MemorialMapApi.create(record, saveSuccess, saveFail);
  }

  return (
    <>
      <Button
        variant="secondary" size="small" 
        onClick={onAddMarker}
        prefixIcon={<CommonIcon.Plus/>}
      >
        {t("Thêm Nhanh")}
      </Button>

      <SlidingPanel 
        className="bg-white"
        orient={SlidingPanelOrient.LeftToRight} 
        visible={addMarkerVisible} 
        header={"Thêm toạ độ mới"}      
        close={() => setAddMarkerVisible(false)}
      >
        <Form 
          clanId={userInfo.clanId}
          onSave={onSave}
        />
      </SlidingPanel>

      <RequestLocation
        visible={requestLoc}
        close={() => setRequestLoc(false)}
      />
    </>
  )
}

function InputLabel({ text, required }: { text: string, required?: boolean }) {
  return <span className="text-primary"> {`${t(text)} ${required ? "*" : ""}`} </span>
}

type NewMarker = {
  name: string;
  description: string;
  lat: string;
  lng: string;
  images: string[];
  clanId: number;
}

function Form({ onSave, clanId }: { 
  // have to provide these due to there is no provider in sliding panel
  clanId: number;
  onSave: (record: NewMarker) => void; 
}) {
  const observer = useBeanObserver({
    name: "",
    description: "",
    lat: "",
    lng: "",
    images: [],
    clanId: clanId,
  } as NewMarker);

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

  const save = async () => {
    const imgBase64s = await blobUrlsToBase64();
    const successLoc = (location: any) => {
      onSave({
        ...observer.getBean(),
        lat: location.latitude,
        lng: location.longitude,
        images: imgBase64s
      } as NewMarker);
    }
    const failLoc = (error: any) => { // could be user decline location access
      onSave(null as any);
    }
    ZmpSDK.getLocation(successLoc, failLoc);
  }

  return (
    <div className="flex-v" style={{ height: "70vh" }}>
      <Input 
        size="small" label={<InputLabel text="Tên Di Tích" required/>}
        value={observer.getBean().name} name="name"
        onChange={observer.watch}
      />
      <Input.TextArea
        size="large" label={<InputLabel text="Mô Tả"/>}
        value={observer.getBean().description} name="description"
        onChange={(e) => observer.update("description", e.target.value)}
      />

      <ImageSelector observer={observer}/>

      <Button variant="primary" size="small" onClick={save} prefixIcon={<CommonIcon.Save/>}>
        {t("save")}
      </Button>

      <span>
        {"Toạ độ sẽ được lấy tại nơi bạn đang đứng"}
      </span>
    </div>
  )
}

interface ImageSelectorProps {
  observer: BeanObserver<NewMarker>;
}
function ImageSelector({ observer }: ImageSelectorProps) {
  const [ images, setImages ] = React.useState<string[]>([]);
  const [ error, setError ] = React.useState('');

  const remove = (index: number) => {
    const remains = images.filter((img, i) => i !== index);
    setImages(remains);
    observer.update("images", remains);
  }

  const Images = () => {
    if (!images.length) return;
    return (
      <>
        {images.map((image, index) => {
          return (
            <SizedBox 
              className="button" key={index}
              width={100} height={100}
            >
              <img src={image} onClick={() => remove(index)}/>
            </SizedBox>
          )
        })}
      </>
    )
  }

  const chooseImage = () => {
    const success = (files: any[]) => {
      if (images.length + files.length > 5) {
        setError("Chọn tối đa 5 ảnh!");
        return;
      }

      const blobs: string[] = [
        ...images,
        ...files.map(file => file.path)
      ];
      setImages(blobs);
      observer.update("images", blobs);
    }

    const fail = () => {
      setError("Chọn tối đa 5 ảnh!");
    }

    ZmpSDK.chooseImage(5, success, fail);
  }

  return (
    <div className="flex-v flex-grow-0">
      <label> {"Ảnh (Tối đa 5 ảnh)"} </label>
      {error && <small className="text-danger"> {error} </small>}

      <Grid columnCount={3} rowSpace="0.5rem" columnSpace="0.5rem">
        <Images/>
        {images.length < 5 && (
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