import React from "react";
import { t } from "i18next";
import { Button, Input, Modal, Text } from "zmp-ui";
import { Gallery } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";

import { GalleryApi } from "api";
import { CommonUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { CommonIcon, Loading } from "components";

import { ServerResponse } from "types/server";

import { GalleryImage } from "./UIGalleryImages";
import { AlbumForm } from "./UICreateAlbum";

const images = [
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
]

interface UIGalleryAlbumDetailProps {
  album: AlbumForm | null;
  onClose: () => void;
  onReloadParent?: () => void;
}

export function UIGalleryAlbumDetail({ album, onClose, onReloadParent }: UIGalleryAlbumDetailProps) {
  if (!album) return null;

  const observer = useBeanObserver(album as AlbumForm);
  const { serverBaseUrl, userInfo } = useAppContext();
  const { successToast, dangerToast, loadingToast } = useNotification();
  const { images,loading, error, refresh } = useGetAlbumImages(observer.getBean().id);

  const [ index, setIndex ] = React.useState(-1);
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);
  const [ remapImages, setRemapImages ] = React.useState<GalleryImage[]>([]);

  React.useEffect(() => {
    const mappedImages = images.map((imgPath: string) => ({
      src: `${serverBaseUrl}/${imgPath}`,
      width: 120,
      height: 120,
      imageFit: "contain",
      isSelected: false,
    } as GalleryImage));
    setRemapImages(mappedImages);
  }, [ images ]);

  const onAddImageToAlbum = async (base64s: string[]) => {
    const content = (
      <div className="flex-v">
        <p> {t("đang chuẩn bị dữ liệu")} </p>
        <p> {t("vui lòng chờ")} </p>
      </div>
    )
    loadingToast(
      content,
      (successToastCB, dangerToastCB) => {
        GalleryApi.addImagesToAlbum({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          albumId: observer.getBean().id,
          base64s: base64s,
          success: (result: ServerResponse) => {
            if (result.status === "success") {
              successToastCB(t("lưu ảnh thành công"))
              refresh()
            } else {
              dangerToastCB(t("lưu ảnh không thành công"))
            }
          },
          fail: () => {
            dangerToastCB(t("lưu ảnh không thành công"))
          }
        })
      }
    )
  }

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

  const onChooseImage = () => {
    const success = async (files: any[]) => {
      if (files.length && files.length > 10) {
        dangerToast(t("Chọn tối đa 10 ảnh"));
        return;
      }
      const blobs: string[] = [ ...files.map(file => file.path) ];
      const base64s = await blobUrlsToBase64(blobs);
      onAddImageToAlbum(base64s);
    }
    const fail = () => {
      dangerToast(t("lưu ảnh không thành công"));
      observer.update("thumbnailPath", "")
    }
    ZmpSDK.chooseImage(10, success, fail);
  }

  const onDelete = () => {
    GalleryApi.deleteAlbum({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      id: observer.getBean().id,
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          if (onReloadParent) onReloadParent();
          onClose();
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
          if (onReloadParent) onReloadParent();
          onClose();
          successToast(t("lưu thành công"));
        } else {
          setDeleteWarning(false);
          dangerToast(t("lưu thất bại"));
        }
      },
      fail: () => {
        setDeleteWarning(false);
        dangerToast(t("lưu thất bại"));
      }
    })
  }

  const onRemoveImages = () => {
    const selectedImagePaths =  remapImages
        .filter(image => image.isSelected)
        .map((image) => image.src.replace(`${serverBaseUrl}/`, ""))

    if (selectedImagePaths.length === 0) {
      dangerToast(t("chọn ít nhất 1 ảnh"));
      return;
    }

    loadingToast(
      <div className="flex-v">
        <p> {t("đang xoá...")} </p>
        <p> {t("vui lòng chờ")} </p>
      </div>,
      (successToastCB, dangerToastCB) => {
        GalleryApi.removeImagesFromAlbum({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          albumId: observer.getBean().id,
          imagePaths: selectedImagePaths,
          success: (result: ServerResponse) => {
            if (result.status === "success") {
              successToastCB(`${t("xoá thành công")} ${selectedImagePaths.length} ảnh`);
              refresh();
            } else {
              dangerToastCB(t("xoá không thành công"));
            }
          },
          fail: () => {
            dangerToastCB(t("xoá không thành công"));
          }
        })
      }
    )
  }

  const handleImageSelect = (index: number, image: GalleryImage) => {
    const updatedImages = remapImages.map((img, idx) => 
      idx === index ? { ...img, isSelected: !img.isSelected } : img
    );
    setRemapImages(updatedImages);
  };

  if (loading) return (<Loading/>) 
  else return (
    <div className="flex-v flex-grow-0 scroll-v p-3">
      {/* 
        TODO: Allow user to change avatar 
        <div className="center flex-v flex-grow-0">
          <img
            className="rounded"
            style={{ width: "85vw", height: "12rem" }}
            src={observer.getBean().thumbnailPath}
            onError={(e) => e.currentTarget.src = "https://fakeimg.pl/600x400?text=Avatar"}
          />
          <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onChooseAvatar}>
            {observer.getFieldValue("thumbnailPath") ? t("Ảnh Khác") : t("Thêm")}
          </Button>
        </div>
      */}
      <Input label={t("Tiêu Đề")} value={observer.getBean().name} onChange={observer.watch}/>
      <>
        <Gallery
          images={remapImages}
          onClick={(index) => setIndex(index)}
          onSelect={handleImageSelect}
          rowHeight={120}
        />
        <Lightbox
          index={index}
          slides={remapImages}
          open={index >= 0}
          close={() => setIndex(-1)}
          plugins={[Zoom, Thumbnails]}
          zoom={{
            scrollToZoom: true,
            maxZoomPixelRatio: 50,
          }}
        />
      </>
      <Input.TextArea 
        label={t("Mô Tả")} value={observer.getBean().description} 
        onChange={(e) => observer.update("description", e.target.value)}
      />

      <Text.Title> {t("Hành Động")} </Text.Title>
      <Text size="large"> {t("Ảnh")} </Text>
      <div className="flex-h">
        <Button 
          size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onChooseImage}
          style={{ minWidth: 120 }}
        >
          {t("Thêm ảnh")}
        </Button>
        <Button 
          size="small" prefixIcon={<CommonIcon.RemovePhoto/>} onClick={onRemoveImages}
          style={{ minWidth: 120 }}
        >
          {t("Xoá ảnh")}
        </Button>
      </div>
      <Text size="large"> {t("Album")} </Text>
      <div className="flex-h">
        <Button 
          size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave}
          style={{ minWidth: 80 }}
        >
          {t("save")}
        </Button>
        <Button 
          size="small" prefixIcon={<CommonIcon.Trash/>} onClick={() => setDeleteWarning(true)}
          style={{ minWidth: 80 }}
        >
          {t("delete")}
        </Button>
      </div>
      <Modal
        visible={deleteWarning}
        mask={false} maskClosable={false}
        title={t("Xoá Album")}
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
    </div>
  );
}

function useGetAlbumImages(albumId: number) {
  const [ images, setImages ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);
  const refresh = () => setReload(!reload);

  const { userInfo } = useAppContext();

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "success") {
        const imgs: string[] = result.data;
        setImages(imgs);
      } else {
        setError(true);
        setImages([]);
      }
    };
    const fail = () => {
      setLoading(false);
      setError(true);
      setImages([])
    }
    GalleryApi.getImagesByAlbum(userInfo.id, userInfo.clanId, albumId!, success, fail);
  }, [ reload ]);

  return { images, loading, error, refresh }
}