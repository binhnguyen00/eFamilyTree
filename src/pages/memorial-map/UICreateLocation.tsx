import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Text } from "zmp-ui";

import { MemorialMapApi } from "api";
import { CommonUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { Coordinate, CommonIcon, Label, SizedBox, BeanObserver } from "components";

import { ServerResponse } from "types/server";

import { MemorialLocation } from "./UIMap";

interface UICreateLocationFormProps {
  coordinate: Coordinate;
  onSuccess?: (record: MemorialLocation) => void;
}

export function UICreateLocationForm(props: UICreateLocationFormProps) {
  const { coordinate, onSuccess } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const observer = useBeanObserver({
    id:           0,
    name:         "",
    description:  "",
    images:       [],
    clanId:       userInfo.clanId,
    coordinate:   coordinate,
    memberId:     0,
    memberName:   ""
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
  const { dangerToast } = useNotification();
  
  const [ imagePaths, setImagePaths ] = React.useState<string[]>([]);

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
    ZmpSDK.chooseImage({
      howMany: 5, 
      success: (files: any[]) => {
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
      },
      fail: () => dangerToast(t("chọn tối đa 5 ảnh"))
    });
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