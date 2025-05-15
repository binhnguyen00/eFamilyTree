import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { CommonUtils, ZmpSDK } from "utils";
import { CommonIcon } from "components";
import { GalleryApi } from "api";
import { ServerResponse } from "types/server";

export interface AlbumForm {
  id: number;
  name: string;
  albumType: string;
  date: string;
  description: string;
  eventId?: number;
  thumbnailPath: string;
  thumbnailBase64?: string;
}
interface UICreateAlbumProps {
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UICreateAlbum(props: UICreateAlbumProps) {
  const { onClose, onReloadParent} = props; 
  const { dangerToast, successToast, warningToast } = useNotification();
  const { userInfo } = useAppContext();
  const fallbackThumbnail = "https://fakeimg.pl/1920x1080?font=roboto";
  
  const observer = useBeanObserver({
    name: "",
    description: "",
    eventId: 0,
    albumType: "",
    thumbnailPath: "",
    thumbnailBase64: ""
  } as AlbumForm);

  React.useEffect(() => {
    // Clean Observer on render
    observer.updateBean({name: "",description: "",eventId: 0,thumbnailPath: "",thumbnailBase64: ""} as AlbumForm);
  }, []) 

  const blobUrlsToBase64 = async (imagePaths: string[]) => {
    const base64Promises = imagePaths.map((blobUrl) => {
      return new Promise<string>((resolve) => {
        CommonUtils.blobUrlToBase64(blobUrl, (base64: string) => {
          resolve(base64);
        });
      });
    });
    const base64Array = await Promise.all(base64Promises);
    return base64Array;
  };

  const onChooseThumbnail = () => {
    ZmpSDK.chooseImage({
      howMany: 1,
      success: async (files: any[]) => {
        if (files.length && files.length > 1) {
          dangerToast(t("Chọn tối đa 1 ảnh"));
          return;
        }
        const blobs: string[] = [ ...files.map(file => file.path) ];
        const base64s = await blobUrlsToBase64(blobs);
        observer.update("thumbnailPath", blobs[0]);
        observer.update("thumbnailBase64", base64s[0]);
      },
      fail: () => {
        dangerToast(t("Chọn tối đa 1 ảnh"));
        observer.update("thumbnailPath", "")
      }
    });
  }

  const onCreate = () => {
    if (!observer.getFieldValue("name")) {
      warningToast(t("nhập đủ thông tin"));
      return;
    }

    GalleryApi.createAlbum({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      album: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          if (onReloadParent) onReloadParent();
          onClose();
          successToast(t("Tạo thành công"));
        } else {
          dangerToast(t("Tạo thất bại"));
        }
      },
      fail: () => {
        dangerToast(t("Tạo thất bại"));
      }
    })  
  }

  return (
    <div className="flex-v flex-grow-0 scroll-v p-3">
      <div className="center flex-v flex-grow-0">
        <img
          className="rounded"
          style={{ width: "85vw", height: "12rem", objectFit: "cover" }}
          src={observer.getBean().thumbnailPath || fallbackThumbnail}
          onError={(e) => {
            if (e.currentTarget.src !== fallbackThumbnail) {
              e.currentTarget.src = fallbackThumbnail;
            }
          }}
        />
        <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onChooseThumbnail}>
          {observer.getFieldValue("thumbnailPath") ? t("sửa") : t("add")}
        </Button>
      </div>

      <Input
        name="name" label={`${t("Tiêu đề")} *`} focused
        value={observer.getBean().name} onChange={observer.watch}
      />
      <Input.TextArea
        name="description" label={t("Mô tả")}
        value={observer.getBean().description} 
        onChange={(e) => observer.update("description", e.target.value)}
      />
      <div className="center">
        <Button size="small" style={{ width: 150 }} prefixIcon={<CommonIcon.Save/>} onClick={onCreate}>
          {t("Lưu")}
        </Button>
      </div>
    </div>
  )
}