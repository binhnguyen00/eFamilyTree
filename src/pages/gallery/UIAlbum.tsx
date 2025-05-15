import React from "react";
import { t } from "i18next";
import { Button, Input, Modal } from "zmp-ui";

import { GalleryApi } from "api";
import { ServerResponse } from "types/server";
import { CommonUtils, ZmpSDK, StyleUtils } from "utils";
import { Header, ScrollableDiv, CommonIcon } from "components";
import { useAppContext, useBeanObserver, useNotification, useRouteNavigate } from "hooks";

import { AlbumForm } from "./UICreateAlbum";
import { UIAlbumPhotos } from "./UIAlbumPhotos";

export function UIAlbum() {
  const { belongings, goBack } = useRouteNavigate();
  const { album } = belongings;
  const observer = useBeanObserver(album as AlbumForm);

  const { userInfo, serverBaseUrl } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const onDelete = () => {
    GalleryApi.deleteAlbum({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      id: observer.getBean().id,
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          goBack();
          successToast(t("xoá thành công"));
        } else {
          setDeleteWarning(false);
          dangerToast(t("xoá thất bại"));
        }
      },
      fail: () => {
        setDeleteWarning(false);
        dangerToast(t("xoá thất bại"));
      }
    })
  }

  const onSave = () => {
    GalleryApi.saveAlbum({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      album: observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          const album = result.data;
          observer.update("name", album.name);
          observer.update("description", album.description);
          observer.update("thumbnailPath", album.thumbnail);
          successToast(t("lưu thành công"));
        } else {
          dangerToast(t("lưu thất bại"));
        }
      },
      fail: () => {
        dangerToast(t("lưu thất bại"));
      }
    })
  }

  const onUpdateThumbnail = () => {
    const update = (base64: string) => {
      GalleryApi.saveAlbum({
        userId: userInfo.id,
        clanId: userInfo.clanId,
        album: {
          ...observer.getBean(),
          thumbnailBase64: base64,
        },
        success: (result: ServerResponse) => {
          if (result.status === "success") {
            const album = result.data;
            observer.update("thumbnailPath", album.thumbnail);
            successToast(t("lưu thành công"));
          } else {
            dangerToast(t("lưu thất bại"));
          }
        },
        fail: () => {
          dangerToast(t("lưu thất bại"));
        }
      })
    }

    ZmpSDK.chooseImage({
      howMany: 1, 
      success: async (files: any[]) => {
        if (files.length && files.length > 1) {
          dangerToast(t("Chọn tối đa 1 ảnh"));
          return;
        }
        const blobs: string[] = [ ...files.map(file => file.path) ];
        const base64s = await CommonUtils.blobUrlsToBase64s(blobs);
        update(base64s[0]);
      },
      fail: () => {
        dangerToast(t("lưu ảnh không thành công"));
      }
    });
  }

  const renderFooter = () => {
    return (
      <div className="flex-h">
        <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave} style={{ minWidth: 80 }}>
          {t("save")}
        </Button>
        <Button size="small" prefixIcon={<CommonIcon.Trash/>} onClick={() => setDeleteWarning(true)} style={{ minWidth: 80 }}>
          {t("delete")}
        </Button>
      </div>
    )
  }

  const renderAlbum = () => {
    const fallbackThumbnail = "https://fakeimg.pl/1920x1080?font=roboto";
    const hasThumbnail: boolean = !!observer.getBean().thumbnailPath;
    return (
      <>
        <div className="center flex-v flex-grow-0 pt-3">
          <img
            className="rounded object-cover" loading="lazy"
            style={{ width: "85vw", height: "12rem" }}
            src={hasThumbnail ? `${serverBaseUrl}/${observer.getBean().thumbnailPath}` : fallbackThumbnail}
            onError={(e) => {
              if (e.currentTarget.src !== fallbackThumbnail) {
                e.currentTarget.src = fallbackThumbnail;
              }
            }}
          />
          <Button size="small" variant="tertiary" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onUpdateThumbnail}>
            {hasThumbnail ? t("Sửa") : t("Thêm")}
          </Button>
        </div>
        <Input.TextArea 
          label={t("Tiêu Đề")} value={observer.getBean().description} size="medium"
          onChange={(e) => observer.update("description", e.target.value)}
        />
        {renderFooter()}
      </>
    )
  }

  return (
    <>
      <Header title={t("album")}/>

      <div className="container bg-white text-base">
        <ScrollableDiv className="flex-v" direction="vertical" height={StyleUtils.calComponentRemainingHeight(0)}>
          {renderAlbum()}
          <UIAlbumPhotos albumId={observer.getBean().id}/>
        </ScrollableDiv>
      </div>

      <Modal
        title={t("Xoá Album")} className="text-base"
        visible={deleteWarning} mask maskClosable
        description={t("Hành động không thể thu hồi, ảnh của bạn sẽ bị xoá. Bạn có chắc muốn xoá album này?")}
        onClose={() => setDeleteWarning(false)}
        actions={[
          {
            text: t("Xoá"),
            onClick: onDelete
          },
          {
            text: t("Đóng"),
            close: true,
          },
        ]}
      />
    </>
  )
}