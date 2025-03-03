import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Sheet, Text } from "zmp-ui";

import { FamilyTreeApi, MemorialMapApi } from "api";
import { CommonUtils, StyleUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Label, Marker, Selection, SizedBox } from "components";

import { FailResponse, ServerResponse } from "types/server";

interface CreateButtonProps {
  onAdd?: (marker: Marker) => void;
  onRequestLocation?: () => void;
}
export function CreateButton(props: CreateButtonProps) {
  const { onAdd, onRequestLocation } = props;
  const { zaloUserInfo } = useAppContext();
  const { "scope.userLocation": locationPermission } = zaloUserInfo.authSettings;
  const { successToast, dangerToast } = useNotification();

  const [ showForm, setShowForm ] = React.useState(false);

  const onAddMarker = () => {
    if (!locationPermission) {
      if (onRequestLocation) onRequestLocation();
    } else {
      if (onAdd) {
        setShowForm(true);
      }
    }
  }

  // TODO: move to Form
  const onSave = (record: NewMarker | any) => {
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
          id: record.id,
          name: record.name,
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
    MemorialMapApi.create({
      record, success: saveSuccess, fail: saveFail
    });
  }

  return (
    <>
      <Button
        style={{ minWidth: 140 }} size="small" 
        prefixIcon={<CommonIcon.Plus/>}
        onClick={onAddMarker}
      >
        {t("Tạo nhanh")}
      </Button>

      <Sheet 
        visible={showForm} title={"Di tích mới"} className="bg-white"
        height={StyleUtils.calComponentRemainingHeight(0)}
        onClose={() => setShowForm(false)}
      >
        <Form onSave={onSave}/>
      </Sheet>
    </>
  )
}

type NewMarker = {
  name: string;
  description: string;
  lat: string;
  lng: string;
  images: string[];
  clanId: number;
}

function Form({ onSave }: { onSave: (record: NewMarker) => void }) {
  const { userInfo } = useAppContext();
  const [ deadMembers, setDeadMembers ] = React.useState<any[]>([]);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const data = result.data as any[];
        const deadMembers = data.map((dead, idx) => {
          return {
            value: dead.id,
            label: `${dead.name}`,
          }
        })
        setDeadMembers(deadMembers);
      }
    }
    const fail = (error: FailResponse) => {};
    FamilyTreeApi.searchDeadMember({userId: userInfo.id, clanId: userInfo.clanId}, success, fail);
  }, []);

  const observer = useBeanObserver({
    name: "",
    description: "",
    lat: "",
    lng: "",
    images: [],
    clanId: userInfo.clanId,
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
    const failLoc = (error: any) => {
      onSave(null as any);
    }
    ZmpSDK.getLocation({
      successCB: successLoc,
      failCB: failLoc
    });
  }

  return (
    <div className="flex-v p-3 scroll-v">
      <p> {t("Toạ độ sẽ được lấy tại nơi bạn đang đứng")} </p>

      <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>

      <Input 
        label={<Label text="Tên Di Tích" required/>}
        value={observer.getBean().name} name="name"
        onChange={observer.watch}
      />

      {/* <Selection
        label={t("Người đã khuất")}
        observer={observer} field={"memberId"}
        options={deadMembers}
        isSearchable
        isClearable
      /> */}

      <Input.TextArea
        size="medium" label={<Label text="Mô Tả"/>}
        value={observer.getBean().description} name="description"
        onChange={(e) => observer.update("description", e.target.value)}
      />

      <ImageSelector observer={observer}/>

      <div>
        <Text.Title className="text-capitalize text-primary py-2"> {t("Hành Động")} </Text.Title>
        <Button variant="primary" size="small" style={{ width: "fit-content" }} onClick={save} prefixIcon={<CommonIcon.Save/>}>
          {t("save")}
        </Button>
      </div>
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