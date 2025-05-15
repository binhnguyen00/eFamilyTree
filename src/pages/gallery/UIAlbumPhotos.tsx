
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

export type Photo = {
  id: number;
  albumId: number;
  url: string;
}

function useSearchAlbumPhotos(albumId: number) {
  const { userInfo } = useAppContext();
  const [ photos, setPhotos ] = React.useState<Photo[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);
  const refresh = () => setReload(!reload);

  const convertToPhoto = (raws: any[]): Photo[] => {
    if (!raws.length) return [];
    return raws.map(raw => {
      return {
        id      : raw["id"],
        albumId : raw["album_id"],
        url     : raw["url"]
      }
    })
  }

  React.useEffect(() => {
    GalleryApi.getImagesByAlbum({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      albumId: albumId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "success") {
          setPhotos(convertToPhoto(result.data));
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

  // TODO: remove hard code
  return { photos, loading: false, error: false, refresh }
}

export function UIAlbumPhotos({ albumId }: { albumId: number }) {
  const { loading, error, refresh } = useSearchAlbumPhotos(albumId);
  const { userInfo } = useAppContext();
  const { successToast, dangerToast, loadingToast } = useNotification();

  const [ isSelecting, setIsSelecting ] = React.useState(false);
  const [ selectedPhotos, setSelectedPhotos ] = React.useState<number[]>([]);
  const [ isTitleSticky, setIsTitleSticky ] = React.useState(false);
  const imageSectionRef = React.useRef<HTMLDivElement>(null);

  const easeIn    = isTitleSticky ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4';
  const bgColor   = isTitleSticky && 'bg-secondary rounded text-primary px-3 py-2';
  const withEase  = "transition-all duration-300 ease-in-out"
  const minWidth  = { minWidth: 100 } as React.CSSProperties;

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

  const togglePhotoSelection = (photo: Photo) => {
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
    let html: React.ReactNode[] = [];
    photos.forEach(photo => {
      const isSelected = selectedPhotos.includes(photo.id);
      html.push(
        <div key={photo.id} className="relative" onClick={() => togglePhotoSelection(photo)}>
          <PhotoView src={photo.url} overlay>
            <img src={photo.url} className="w-full h-full object-cover"/>
          </PhotoView>
          {isSelecting && (
            <div className={`absolute bottom-2 left-2 w-6 h-6 rounded-full flex items-center justify-center ${withEase} ${isSelected ? 'bg-primary' : 'bg-white/50'}`}>
              {isSelected && <CommonIcon.CheckCircle size="1rem" className="text-white"/>}
            </div>
          )}
        </div>
      )
    })
    return html;
  }

  const onSelectPhotos = () => {
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
      dangerToast(t("chọn ít nhất 1 ảnh"));
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
    return <Retry title={t("Chưa có dữ liệu")} onClick={() => refresh()}/>
  } else {
    return (
      <div>
        <div ref={imageSectionRef} className="h-0"/>
  
        <div style={{ zIndex: 999 }} className={`scroll-h sticky top-0 py-3 ${withEase}`}>
          <Text size={isTitleSticky ? "small" : "xLarge"} style={minWidth} className="bold flex-h content-center align-start box-shadow" onClick={onSelectAllPhotos}>
            {isSelecting ? (
              <p className={`${withEase} ${bgColor}`}> {`${t("Chọn")} (${selectedPhotos.length})`} </p>
            ) : (
              <p className={`${withEase} ${bgColor}`}> {`${t("Ảnh")} (${photos.length})`} </p>
            )}
          </Text>
  
          <div className={`flex-h ${withEase} ${easeIn}`}>
            <Button className="box-shadow" size="small" variant="secondary" style={minWidth} prefixIcon={<CommonIcon.AddPhoto/>} onClick={onAddPhotos}>
              {t("add")}
            </Button>
  
            {isSelecting && selectedPhotos.length > 0 && (
              <Button className="box-shadow" size="small" variant="secondary" style={minWidth} prefixIcon={<CommonIcon.RemovePhoto/>} onClick={onDeletePhotos}>
                {t("delete")}
              </Button>
            )}
  
            <Button className="box-shadow" size="small" variant="secondary" style={minWidth} prefixIcon={isSelecting && <CommonIcon.Check/>} onClick={onSelectPhotos}>
              {isSelecting ? t("xong") : t("select")}
            </Button>
          </div>
        </div>
  
        <PhotoProvider maskOpacity={0.5} maskClosable>
          <Grid columnCount={2} rowSpace="1rem" columnSpace="1rem">
            {renderPhotos()}
          </Grid>
          <br/>
        </PhotoProvider>
  
      </div>
    )
  }
}