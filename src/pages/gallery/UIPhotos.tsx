import React from "react";
import { t } from "i18next";
import { Grid } from "zmp-ui";
import { PhotoProvider, PhotoView } from 'react-photo-view';

import { GalleryApi } from "api";
import { useAppContext } from "hooks";
import { CommonUtils, DivUtils } from "utils";
import { ServerResponse, Photo } from "types";
import { Loading, Header, Retry, ScrollableDiv, Divider, TailSpin } from "components";

interface UIPhotosProps {}
export function UIPhotos(props: UIPhotosProps) {
  const {  } = props;
  const { photos,loading, error, refresh } = useSearchAllPhotos();

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
      <Header title={`${t("ảnh")} (${size})`}/>

      <div className="container bg-white text-base">
        <Divider size={0}/>
        <ScrollableDiv className="flex-v" direction="vertical" height={DivUtils.calculateHeight(200)}>
          {renderContainer()}
        </ScrollableDiv>
      </div>
    </>
  )
}

function UIPhotosContainer({ photos }: { photos: Photo[] }) {
  const { serverBaseUrl } = useAppContext();

  const renderPhotos = (): React.ReactNode[] => {
    if (!photos.length) return [];

    const { width, height } = { width: 200, height: 200 }
    const fallbackImage = `https://placehold.jp/30/ededed/000000/${width}${height}.png?text=%3A(`;

    return photos.map((photo: Photo) => {
      const src = `${serverBaseUrl}/${photo.url}`;
      return (
        <PhotoView src={src} key={photo.id}>
          <img
            src={src}
            className="w-full h-full object-cover" loading="lazy" style={{ width: width, height: height }}
            onError={(e) => e.currentTarget.src !== fallbackImage && (e.currentTarget.src = fallbackImage)}
          />
        </PhotoView>
      )
    })
  }

  return (
    <PhotoProvider maskOpacity={0.5} maskClosable pullClosable loadingElement={<TailSpin/>}>
      <Grid columnCount={3} rowSpace="1rem" columnSpace="1rem">
        {renderPhotos()}
      </Grid>
      <br/>
    </PhotoProvider>
  )
}

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
          setPhotos(CommonUtils.convertToPhoto(result.data, "album_id"));
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