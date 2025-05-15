import React from "react";
import { t } from "i18next";
import { Grid } from "zmp-ui";
import { Image } from "react-grid-gallery"; // TODO: remove this
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { GalleryApi } from "api";
import { useAppContext } from "hooks";
import { ServerResponse } from "types/server";
import { Loading, Header, Retry, ScrollableDiv, Divider } from "components";

import { convertToPhoto, Photo } from "./UIAlbumPhotos";
import { StyleUtils } from "utils";

interface UIPhotosProps {}
export function UIPhotos(props: UIPhotosProps) {
  const {  } = props;
  const { photos, loading, error, refresh } = useSearchAllPhotos();

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Retry title={t("không tìm thấy ảnh")} onClick={refresh}/>
    } else {
      return (
        <UIPhotosContainer photos={photos}/>
      )
    }
  }

  const size = photos.length || 0;
  return (
    <>
      <Header title={`${size} ${t("ảnh")}`}/>

      <div className="container bg-white text-base">
        <Divider size={0}/>
        <ScrollableDiv className="flex-v" direction="vertical" height={StyleUtils.calComponentRemainingHeight(0)}>
          {renderContainer()}
        </ScrollableDiv>
      </div>
    </>
  )
}

function UIPhotosContainer({ photos }: { photos: Photo[] }) {
  const { serverBaseUrl } = useAppContext();
  const hasOnePhoto: boolean = photos.length === 1;

  const renderPhotos = (): React.ReactNode[] => {
    if (!photos.length) return [];
    
    return photos.map((photo: Photo) => {
      return (
        <PhotoView src={`${serverBaseUrl}/${photo.url}`} key={photo.id}>
          <img loading="lazy" src={`${serverBaseUrl}/${photo.url}`} className="w-full h-full object-cover"/>
        </PhotoView>
      )
    })
  }

  return (
    <PhotoProvider maskOpacity={0.5} maskClosable pullClosable>
      <Grid columnCount={hasOnePhoto ? 1 : 3} rowSpace="1rem" columnSpace="1rem">
        {renderPhotos()}
      </Grid>
      <br/>
    </PhotoProvider>
  )
}

/**@deprecated */
export interface GalleryImage extends Image {}

function useSearchAllPhotos() {
  const { userInfo } = useAppContext();

  const [ photos, setPhotos ] = React.useState<Photo[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setPhotos([])
    
    GalleryApi.getAllImages({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      fromDate: "",
      toDate: "",
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          setPhotos(convertToPhoto(result.data));
        } else {
          setPhotos([]);
          setError(true);
        }
        setLoading(false);
      },
      fail: () => {
        setPhotos([]);
        setLoading(false);
        setError(true);
      }
    });
  }, [reload]);

  return { photos, loading, error, refresh };
}