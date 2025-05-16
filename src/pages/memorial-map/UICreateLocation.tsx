import React from "react";
import { t } from "i18next";
import { v4 as uuid } from "uuid";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Button, Grid, Input, Text } from "zmp-ui";

import { MemorialMapApi } from "api";
import { CommonUtils, ZmpSDK } from "utils";
import { ServerResponse } from "types/server";
import { useAppContext, useBeanObserver, useNotification, useFamilyTree } from "hooks";
import { MapCoordinate, CommonIcon, Label, Selection, SelectionOption, BeanObserver, SizedBox, ScrollableDiv } from "components";

import { MemorialLocation } from "./UIMap";

interface UICreateLocationFormProps {
  coordinate: MapCoordinate;
  onSuccess?: (record: MemorialLocation) => void;
}

export function UICreateLocationForm(props: UICreateLocationFormProps) {
  const { coordinate, onSuccess } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();
  const { useDeadMembers } = useFamilyTree();
  const { members } = useDeadMembers();

  const observer = useBeanObserver({
    id:           0,
    name:         "",
    description:  "",
    photoUrl:     [],
    clanId:       userInfo.clanId,
    coordinate:   coordinate,
    memberId:     0,
    memberName:   ""
  } as MemorialLocation)

  const onCreate = async () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    
    const imgBase64s: string[] = observer.getBean().photoUrl || [];
    loadingToast({
      content: <p> {t("đang xử lý...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        MemorialMapApi.create({
          record: {
            id:           observer.getBean().id,
            clanId:       userInfo.clanId,
            name:         observer.getBean().name,
            description:  observer.getBean().description,
            coordinate:   observer.getBean().coordinate,
            memberId:     observer.getBean().memberId,
            photoUrl:     imgBase64s,
          },
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("tạo không thành công"));
            } else {
              successToastCB(t("tạo thành công"));
              const record = result.data;
              if (onSuccess) onSuccess({
                id:           record.id,
                name:         record.name,
                description:  record.description,
                photoUrl:     record.images,
                clanId:       record["clan_id"],
                memberId:     record["member_id"],
                memberName:   record["member_name"],
                coordinate: { 
                  lat: parseFloat(record.lat),
                  lng: parseFloat(record.lng)
                },
              } as MemorialLocation);
            }
          },
          fail: () => dangerToastCB(t("tạo không thành công"))
        });
      }
    })
  }

  return (
    <ScrollableDiv direction="vertical" className="flex-v p-3">
      <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>

      <Input 
        label={<Label text="Tên Di Tích" required/>}
        value={observer.getBean().name} name="name"
        onChange={observer.watch}
      />

      <Selection
        label={t("Người đã khuất")}
        observer={observer} field={"memberId"}
        defaultValue={{ 
          value: observer.getBean().memberId || 0, 
          label: observer.getBean().memberName || ""  
        }}
        options={members}
        onChange={(value: SelectionOption) => {
          observer.update("memberId", value.value);
          observer.update("memberName", value.label);
        }}
      />

      <Input.TextArea
        size="large" label={<Label text="Mô Tả"/>}
        value={observer.getBean().description} name="description"
        onChange={(e) => observer.update("description", e.target.value)}
      />

      <UIPhotoSelector observer={observer}/>

      <div className="flex-v center">
        <Button variant="primary" size="small" onClick={onCreate} prefixIcon={<CommonIcon.Save/>} style={{ width: 120 }}>
          {t("save")}
        </Button>
      </div>
    </ScrollableDiv>
  )
}

interface ImageSelectorProps {
  observer: BeanObserver<MemorialLocation>;
}
export function UIPhotoSelector(props: ImageSelectorProps) {
  const { observer } = props;
  const { dangerToast, warningToast } = useNotification();
  const { photoWidth, photoHeight } = { photoWidth: 100, photoHeight: 100 };

  const [isSelecting, setIsSelecting] = React.useState<boolean>(false);
  const [selectedPhotos, setSelectedPhotos] = React.useState<{ id: string; url: string }[]>([]);
  const [photoUrls, setPhotoUrls] = React.useState<string[]>([]);

  // Smooth transition utility
  const withEase: string = "transition-all duration-300 ease-in-out hover:scale-105";

  const onSelectionMode = (): void => {
    setIsSelecting(!isSelecting);
    if (!isSelecting) {
      setSelectedPhotos([]);
    }
  };

  const onSelectPhoto = (photo: { id: string; url: string }): void => {
    if (!isSelecting) return;
    setSelectedPhotos((prev) => {
      if (prev.some((p) => p.id === photo.id)) {
        return prev.filter((p) => p.id !== photo.id);
      } else {
        return [...prev, photo];
      }
    });
  };

  const onRemovePhotos = async (): Promise<void> => {
    if (selectedPhotos.length === 0) {
      warningToast(t("chọn ít nhất 1 ảnh"));
      return;
    }
    try {
      const remainingUrls: string[] = photoUrls.filter(
        (url) => !selectedPhotos.some((p) => p.url === url)
      );
      const base64s: string[] = await CommonUtils.blobUrlsToBase64s(remainingUrls);
      setPhotoUrls(remainingUrls);
      observer.update("photoUrl", base64s);
      setSelectedPhotos([]);
      setIsSelecting(false);
    } catch (error) {
      dangerToast(t("xóa ảnh thất bại, vui lòng thử lại"));
    }
  };

  const onAddPhotos = (): void => {
    ZmpSDK.chooseImage({
      howMany: 5,
      success: async (files: any[]) => {
        if (photoUrls.length + files.length > 5) {
          warningToast(t("chọn tối đa 5 ảnh"));
          return;
        }
        const urls: string[] = [...photoUrls, ...files.map((file) => file.path)];
        const base64s: string[] = await CommonUtils.blobUrlsToBase64s(urls);
        setPhotoUrls(urls);
        observer.update("photoUrl", base64s);
      },
      fail: () => warningToast(t("chọn tối đa 5 ảnh")),
    });
  };

  const renderPhotos = (): React.ReactNode => {
    return photoUrls.map((srcUrl: string) => {
      const photo = { id: uuid(), url: srcUrl };
      const isSelected: boolean = selectedPhotos.some((p) => p.url === photo.url);
      return (
        <div key={photo.id} className="relative" onClick={() => onSelectPhoto(photo)}>
          {isSelecting ? (
            <>              
              <img
                src={photo.url}
                className="object-cover transition-opacity duration-300 ease-in-out hover:opacity-90"
                style={{ width: photoWidth, height: photoHeight }}
              />
              <div
                className={`absolute bottom-2 left-2 w-7 h-7 rounded-full ${
                  isSelected ? 'bg-primary' : 'bg-white/50'
                }`}
              >
                {isSelected && <CommonIcon.CheckCircle className="text-white w-7 h-7" />}
              </div>
            </>
          ) : (
            <PhotoView src={photo.url} key={photo.id}>
              <img
                src={photo.url}
                className="object-cover transition-opacity duration-300 ease-in-out hover:opacity-90"
                style={{ width: photoWidth, height: photoHeight }}
              />
            </PhotoView>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex-v flex-grow-0">
      <div className="flex-h flex-grow-0 justify-between">
        <Text size={"small"} className="bold flex-h content-center align-start" style={{ minWidth: 120 }}>{`${t("Ảnh")} (${photoUrls.length})`}</Text>
        <div className="flex-h">
          <Button size="small" className={withEase} variant="tertiary" prefixIcon={isSelecting && <CommonIcon.Check />} onClick={onSelectionMode}>
            {isSelecting ? t("xong") : t("select")}
          </Button>
          {isSelecting && selectedPhotos.length > 0 && (
            <Button size="small" className={withEase} variant="tertiary" prefixIcon={<CommonIcon.RemovePhoto />} onClick={onRemovePhotos}>
              {t("delete")}
            </Button>
          )}
        </div>
      </div>
      <PhotoProvider maskOpacity={0.5} maskClosable pullClosable bannerVisible={false}>
        <Grid columnCount={3} rowSpace="1rem" columnSpace="1rem">
          {renderPhotos()}
          {photoUrls.length < 5 && (
            <SizedBox
              className={`${withEase} button flex-h text-underline`}
              width={photoWidth} height={photoHeight} onClick={onAddPhotos}
            >
              <CommonIcon.AddPhoto /> {t("add")}
            </SizedBox>
          )}
        </Grid>
      </PhotoProvider>
    </div>
  );
}