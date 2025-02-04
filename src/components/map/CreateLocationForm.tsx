import React from "react";
import { t } from "i18next";
import { Button, Grid, Input } from "zmp-ui";

import { useBeanObserver } from "hooks";
import { CommonUtils, ZmpSDK } from "utils";
import { SizedBox, CommonIcon, BeanObserver, Marker } from "components";
import { ServerResponse } from "types/server";
import { MemorialMapApi } from "api";

interface CreateLocationFormProps {
  lat: string;
  lng: string;
  clanId: number;
  saveSuccess: (record: Marker) => void;
  successToast: (content: any) => void;
  dangerToast: (content: any) => void;
}

type NewMarker = {
  name: string;
  description: string;
  lat: string;
  lng: string;
  images: string[];
  clanId: number;
}

function InputLabel({ text, required }: { text: string, required?: boolean }) {
  return <span className="text-primary"> {`${t(text)} ${required ? "*" : ""}`} </span>
}

export function CreateLocationForm({ lat, lng, clanId, saveSuccess, successToast, dangerToast }: CreateLocationFormProps) {
  const [ error, setError ] = React.useState("");
  const observer = useBeanObserver({
    name: "",
    description: "",
    lat: lat,
    lng: lng,
    images: [],
    clanId: clanId,
  } as NewMarker)

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

  const onSave = async () => {
    if (!observer.getBean().name) {
      setError("Nhập đủ thông tin");
      return;
    }

    const imgBase64s = await blobUrlsToBase64();
    const success = (result: ServerResponse) => {
      if (result.status !== "error") {
        const record = result.data;
        saveSuccess({
          label: record.name,
          description: record.description,
          images: record.images,
          coordinate: {
            lat: parseFloat(record.lat),
            lng: parseFloat(record.lng)
          }
        } as Marker);
        successToast(`${t("save")} ${t("success")}`);
      } else fail(null);
    }
    const fail = (error: any) => {
      dangerToast(`${t("save")} ${t("fail")}`)
    }
    MemorialMapApi.create({
      clanId: clanId,
      name: observer.getBean().name,
      description: observer.getBean().description,
      lat: observer.getBean().lat,
      lng: observer.getBean().lng,
      images: imgBase64s,
    }, success, fail);
  }

  return (
    <div className="flex-v" style={{ height: "70vh" }}>
      {error && <p className="text-primary"> {error} </p>}
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

      <Button variant="primary" size="small" onClick={onSave} prefixIcon={<CommonIcon.Save/>}>
        {t("save")}
      </Button>
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