import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Sheet, Text } from "zmp-ui";

import { FamilyTreeApi, MemorialMapApi } from "api";
import { CommonUtils, StyleUtils, ZmpSDK } from "utils";
import { BeanObserver, CommonIcon, Label, Selection, SizedBox } from "components";
import { useAppContext, useBeanObserver, useNotification, useRequestLocationContext } from "hooks";

import { FailResponse, ServerResponse } from "types/server";

import { MemorialLocation } from "../UIMap";

interface QuickCreateLocationButtonProps {
  onSuccessCreate?: (marker: MemorialLocation) => void;
}
export function QuickCreateLocationButton(props: QuickCreateLocationButtonProps) {
  const { onSuccessCreate } = props;
  const { loadingToast } = useNotification();
  const { needLocation, requestLocation } = useRequestLocationContext();

  const [ showForm, setShowForm ] = React.useState(false);

  const onCreate = () => {
    if (needLocation) {
      requestLocation();
      return;
    }
    if (onSuccessCreate) setShowForm(true);
  }

  const onSave = (record: MemorialLocation) => {
    loadingToast(
      <p> {t("đang xử lý...")} </p>,
      (successToastCB, dangerToastCB) => {
        if (!record) {
          dangerToastCB(`${t("save")} ${t("fail")}`);
          return;
        };
        if (!record.name) {
          dangerToastCB(t("nhập đủ thông tin"));
          return;
        };
        MemorialMapApi.create({
          record, 
          success: (result: ServerResponse) => {
            if (!onSuccessCreate) return;
            if (result.status !== "error") {
              successToastCB(`${t("save")} ${t("success")}`);
              onSuccessCreate(record);
            } else {
              dangerToastCB(t("lưu thất bại"))
            }
          }, 
          fail: () => dangerToastCB(`${t("save")} ${t("fail")}`)
        });
      }
    )
  }

  return (
    <>
      <Button
        style={{ minWidth: 140 }} size="small" 
        prefixIcon={<CommonIcon.Plus/>}
        onClick={onCreate}
      >
        {t("Tạo nhanh")}
      </Button>

      <Sheet 
        visible={showForm} title={"Di tích mới"} className="bg-white"
        height={StyleUtils.calComponentRemainingHeight(0)}
        onClose={() => setShowForm(false)}
      >
        <UIQuickCreateLocationForm onSave={onSave}/>
      </Sheet>
    </>
  )
}

interface UICreateLocationFormProps {
  onSave: (record: MemorialLocation) => void;
}
function UIQuickCreateLocationForm(props: UICreateLocationFormProps) {
  const { onSave } = props;
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
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
    id: 0,
    name: "",
    description: "",
    clanId: userInfo.clanId,
    images: [],
    coordinate: { 
      lat: 0, 
      lng: 0 
    },
    memberId: 0,
    memberName: "",
  } as MemorialLocation);

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
    loadingToast(
      <p> {t("đang lấy toạ độ hiện tại...")} </p>,
      (successToastCB, dangerToastCB) => {
        ZmpSDK.getLocation({
          successCB: (location: any) => {
            successToastCB(t("thành công"))
            onSave({
              ...observer.getBean(),
              coordinate: {
                lat: parseFloat(location.latitude),
                lng: parseFloat(location.longitude)
              },
              images: imgBase64s
            } as MemorialLocation);
          },
          failCB: () => dangerToastCB(t("lấy toạ độ không thành công"))
        });
      }
    )
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

      <Selection
        label={t("Người đã khuất")}
        observer={observer} field={"memberId"}
        options={deadMembers}
        isSearchable
        isClearable
      />

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
  observer: BeanObserver<MemorialLocation>;
}
function ImageSelector({ observer }: ImageSelectorProps) {
  const [ images, setImages ] = React.useState<string[]>([]);
  const { successToast, dangerToast } = useNotification();

  const onRemove = (index: number) => {
    const remains = images.filter((img, i) => i !== index);
    setImages(remains);
    observer.update("images", remains);
  }

  const renderImages = () => {
    const imgs: React.ReactNode[] = React.useMemo(() => {
      return images.map((image, index) => {
        return (
          <SizedBox 
            className="button" key={index}
            width={100} height={100}
          >
            <img src={image} onClick={() => onRemove(index)}/>
          </SizedBox>
        )
      })
    }, [ images ])
    return imgs;
  }

  const chooseImage = () => {
    const success = (files: any[]) => {
      if (images.length + files.length > 5) {
        dangerToast(t("chọn tối đa 5 ảnh"))
        return;
      }
      const blobs: string[] = [
        ...images,
        ...files.map(file => file.path)
      ];
      setImages(blobs);
      observer.update("images", blobs);
      successToast(t("cập nhật thành công"));
    }
    const fail = () => dangerToast(t("chọn tối đa 5 ảnh"))
    ZmpSDK.chooseImage(5, success, fail);
  }

  return (
    <div className="flex-v flex-grow-0">
      <label> {t("Ảnh (Tối đa 5 ảnh)")} </label>

      <Grid columnCount={3} rowSpace="0.5rem" columnSpace="0.5rem">
        {renderImages()}

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