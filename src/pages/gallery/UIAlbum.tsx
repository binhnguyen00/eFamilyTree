import React from "react";
import { t } from "i18next";
import { Button, Input, Modal } from "zmp-ui";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { GalleryApi } from "api";
import { ServerResponse } from "types/server";
import { CommonUtils, ZmpSDK, DivUtils } from "utils";
import { Header, ScrollableDiv, CommonIcon } from "components";
import { useAppContext, useBeanObserver, useNotification, useRouteNavigate } from "hooks";

import { AlbumForm } from "./UICreateAlbum";
import { UIAlbumPhotos } from "./UIAlbumPhotos";

export function UIAlbum() {
  const { belongings, goTo } = useRouteNavigate();
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
          setDeleteWarning(false);
          successToast(t("Xoá thành công"));
          goTo({ path: "gallery", replace: true });
        } else {
          setDeleteWarning(false);
          dangerToast(t("Xoá thất bại"));
        }
      },
      fail: () => {
        setDeleteWarning(false);
        dangerToast(t("Xoá thất bại"));
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
          successToast(t("Lưu thành công"));
        } else {
          dangerToast(t("Lưu thất bại"));
        }
      },
      fail: () => {
        dangerToast(t("Lưu thất bại"));
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
            successToast(t("Lưu thành công"));
          } else {
            dangerToast(t("Lưu thất bại"));
          }
        },
        fail: () => {
          dangerToast(t("Lưu thất bại"));
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
        dangerToast(t("Lưu ảnh không thành công"));
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
    const fallbackThumbnail = "https://placehold.jp/30/ededed/000000/480x270.png?text=%E1%BA%A2nh%20B%C3%ACa"; // text = Ảnh Bìa
    const hasThumbnail: boolean = !!observer.getBean().thumbnailPath;
    const src: string = hasThumbnail ? `${serverBaseUrl}/${observer.getBean().thumbnailPath}` : fallbackThumbnail;

    return (
      <>
        <div className="center flex-v flex-grow-0 pt-3">
          <PhotoProvider maskOpacity={0.5} maskClosable pullClosable bannerVisible={false}>
            <PhotoView src={src}>
              <img
                className="rounded object-cover"
                style={{ width: "85vw", height: "12rem" }}
                src={src}
                onError={(e) => {
                  if (e.currentTarget.src !== fallbackThumbnail) {
                    e.currentTarget.src = fallbackThumbnail;
                  }
                }}
              />
            </PhotoView>
          </PhotoProvider>
          <Button size="small" variant="tertiary" className="button-link" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onUpdateThumbnail}>
            {hasThumbnail ? t("Sửa") : t("Thêm")}
          </Button>
        </div>
        <div className="flex-v">
          <Input.TextArea 
            label={t("Tiêu Đề")} value={observer.getBean().description} size="medium"
            onChange={(e) => observer.update("description", e.target.value)}
          />
          {renderFooter()}
        </div>
      </>
    )
  }

  return (
    <>
      <Header title={t("album")}/>

      <div className="container bg-white text-base">
        <ScrollableDiv direction="vertical" height={DivUtils.calculateHeight(0)}>
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