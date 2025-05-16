import React from "react";

import { t } from "i18next";
import { Button, Grid, Text } from "zmp-ui";
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { GalleryApi } from "api";
import { ServerResponse } from "types/server";
import { CommonUtils, ZmpSDK } from "utils";
import { CommonIcon, Loading, Retry } from "components";
import { useAppContext, useNotification } from "hooks";

// dummies
const photos = [
  { "id": 1, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 2, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 3, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 4, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 5, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 6, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 7, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 8, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 9, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 10, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
  { "id": 11, "albumId": 1, "url": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU" },
]

export interface Photo {
  id: number;
  parentId: number;
  url: string;
}

function useSearchAlbumPhotos(albumId: number) {
  const { userInfo } = useAppContext();
  const [ photos, setPhotos ] = React.useState<Photo[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    GalleryApi.getImagesByAlbum({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      albumId: albumId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "success") {
          setPhotos(CommonUtils.convertToPhoto(result.data, "album_id"));
        } else {
          setError(true);
          setPhotos([]);
        }
      },
      fail: () => {
        setLoading(false);
        setError(true);
        setPhotos([])
      }
    });
  }, [ reload ]);

  return { photos, loading, error, refresh }
}

export function UIAlbumPhotos({ albumId }: { albumId: number }) {
  const { photos, loading, error, refresh } = useSearchAlbumPhotos(albumId);
  const { userInfo, serverBaseUrl } = useAppContext();
  const { dangerToast, loadingToast, warningToast } = useNotification();

  const [ isSelecting, setIsSelecting ] = React.useState(false);
  const [ selectedPhotos, setSelectedPhotos ] = React.useState<number[]>([]);
  const [ isTitleSticky, setIsTitleSticky ] = React.useState(false);
  const imageSectionRef = React.useRef<HTMLDivElement>(null);

  const easeIn    = isTitleSticky ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-4';
  const bgColor   = isTitleSticky && 'bg-secondary rounded text-primary px-3 py-2';
  const withEase  = "transition-all duration-300 ease-in-out"
  const minWidth  = { minWidth: 80 } as React.CSSProperties;

  // check if the user has scroll to the photos section
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTitleSticky(!entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (imageSectionRef.current) {
      observer.observe(imageSectionRef.current);
    }

    return () => {
      if (imageSectionRef.current) {
        observer.unobserve(imageSectionRef.current);
      }
    };
  }, []);

  const onSelectPhoto = (photo: Photo) => {
    if (!isSelecting) return;
    setSelectedPhotos(prev => {
      if (prev.includes(photo.id)) {
        return prev.filter(p => p !== photo.id);
      } else {
        return [...prev, photo.id];
      }
    });
  };

  const renderPhotos = (): React.ReactNode[] => {
    return photos.map((photo: Photo) => {
      const isSelected: boolean = selectedPhotos.includes(photo.id);
      return (
        <div key={photo.id} className="relative" onClick={() => onSelectPhoto(photo)}>
          {isSelecting ? (
            <>
              <img src={`${serverBaseUrl}/${photo.url}`} className="object-cover"/>
              <div className={`absolute bottom-2 left-2 w-7 h-7 rounded-full ${withEase} ${isSelected ? 'bg-primary' : 'bg-white/50'}`}>
                {isSelected && <CommonIcon.CheckCircle className="text-white w-7 h-7"/>}
              </div>
            </>
          ): (
            <PhotoView src={`${serverBaseUrl}/${photo.url}`} key={photo.id}>
              <img src={`${serverBaseUrl}/${photo.url}`} className="object-cover"/>
            </PhotoView>
          )}
        </div>
      )
    })
  }

  const onSelectionMode = () => {
    setIsSelecting(!isSelecting);
    if (!isSelecting) {
      setSelectedPhotos([]);
    }
  }

  const onSelectAllPhotos = () => {
    if (isSelecting) {
      setSelectedPhotos([])
      setSelectedPhotos(photos.map(photo => photo.id));
    } else {
      setSelectedPhotos([]);
    }
  }

  const onDeletePhotos = () => {
    if (selectedPhotos.length === 0) {
      warningToast(t("chọn ít nhất 1 ảnh"));
      return;
    }

    loadingToast({
      content: <p> {t("đang xoá...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        GalleryApi.removeImagesFromAlbum({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          albumId: albumId,
          photoIds: selectedPhotos,
          success: (result: ServerResponse) => {
            if (result.status === "success") {
              successToastCB(`${t("xoá thành công")} ${selectedPhotos.length} ảnh`);
              setSelectedPhotos([]);
              setIsSelecting(false);
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
    })
  }

  const onAddPhotoToAlbum = async (base64s: string[]) => {
    loadingToast({
      content: <p> {t("đang chuẩn bị dữ liệu...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        GalleryApi.addPhotosToAlbum({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          albumId: albumId,
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
    })
  }

  const onAddPhotos = () => {
    ZmpSDK.chooseImage({
      howMany: 10, 
      success: async (files: any[]) => {
        if (files.length && files.length > 10) {
          dangerToast(t("Chọn tối đa 10 ảnh"));
          return;
        }
        const blobs: string[] = [ ...files.map(file => file.path) ];
        const base64s = await CommonUtils.blobUrlsToBase64s(blobs);
        onAddPhotoToAlbum(base64s);
      },
      fail: () => {
        dangerToast(t("lưu ảnh không thành công"));
      }
    });
  }

  if (loading) {
    return <Loading/>
  } else if (error) {
    return (
      <>
        <Retry title="" message={t("Gặp Sự Cố!")} onClick={() => refresh()} buttonType="tertiary"/>
        <br/>
      </>
    )
  } else {
    return (
      <div className="min-h-[100vh]">
        <div ref={imageSectionRef} className="h-0"/>
  
        <div style={{ zIndex: 999 }} className={`scroll-h sticky justify-between top-0 py-3 ${withEase}`}>
          <Text size={"small"} style={{ minWidth: 120 }} className="bold flex-h content-center align-start" onClick={onSelectAllPhotos}>
            {isSelecting ? (
              <p className={`${withEase} ${bgColor}`}> {`${t("Chọn")} (${selectedPhotos.length})`} </p>
            ) : (
              <p className={`${withEase} ${bgColor}`}> {`${t("Ảnh")} (${photos.length})`} </p>
            )}
          </Text>
  
          <div className={`flex-h ${withEase}`}>
            <Button size="small" className={`${easeIn} ${withEase} ${bgColor}`} variant={isTitleSticky ? "secondary" : "tertiary"} style={minWidth} prefixIcon={<CommonIcon.AddPhoto/>} onClick={onAddPhotos}>
              {t("add")}
            </Button>
  
            {isSelecting && selectedPhotos.length > 0 && (
              <Button size="small" className={`${easeIn} ${withEase} ${bgColor}`} variant={isTitleSticky ? "secondary" : "tertiary"} style={minWidth} prefixIcon={<CommonIcon.RemovePhoto/>} onClick={onDeletePhotos}>
                {t("delete")}
              </Button>
            )}
  
            {photos.length > 0 && (
              <Button size="small" className={`${easeIn} ${withEase} ${bgColor}`} variant={isTitleSticky ? "secondary" : "tertiary"} style={minWidth} prefixIcon={isSelecting && <CommonIcon.Check/>} onClick={onSelectionMode}>
                {isSelecting ? t("xong") : t("select")}
              </Button>
            )}
          </div>
        </div>
  
        <PhotoProvider maskOpacity={0.5} maskClosable pullClosable>
          <Grid columnCount={2} rowSpace="1rem" columnSpace="1rem">
            {renderPhotos()}
          </Grid>
          <br/>
        </PhotoProvider>
  
      </div>
    )
  }
}