import React from "react";
import { t } from "i18next";

import { Gallery, Image } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { GalleryApi } from "api";
import { useAppContext } from "hooks";
import { Info, Loading, Header, ScrollableDiv } from "components";

import { ServerResponse } from "types/server";
import { StyleUtils } from "utils";

interface UIGalleryImagesProps {
}
export function UIGalleryImages(props: UIGalleryImagesProps) {
  const {  } = props;
  const { serverBaseUrl } = useAppContext();
  const { images, loading, error, refresh } = useGalleryImages();

  const remapImages: GalleryImage[] = React.useMemo(() => {
    return images.map((imgPath: string) => ({
      src: `${serverBaseUrl}/${imgPath}`,
      width: 150,
      height: 150,
      imageFit: "contain",
    }));
  }, [ images ]);

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (!images.length) {
      return (
        <div className="flex-v flex-grow-0">
          <Info 
            className="text-base py-3" 
            title={t("Không có ảnh")} 
            message={t("Hãy thêm album để thêm ảnh")}
          />
        </div>
      )
    } else {
      return (
        <UIGalleryImagesContainer images={remapImages}/>
      )
    }
  }

  return (
    <>
      <Header title={`${remapImages.length} ${t("ảnh")}`}/>

      <div className="container bg-white text-base">
        {renderContainer()}
      </div>
    </>
  )
}

interface UIGalleryImagesContainerProps {
  images: GalleryImage[];
}
function UIGalleryImagesContainer(props: UIGalleryImagesContainerProps) {
  const { images } = props;
  const [ index, setIndex ] = React.useState(-1);
  return (
    <ScrollableDiv direction="vertical" style={{ height: StyleUtils.calComponentRemainingHeight(10) }}>
      <Gallery 
        images={images} 
        onClick={(index) => setIndex(index)} 
        enableImageSelection={false} 
        rowHeight={150}
      />
      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 50,
        }}
        close={() => setIndex(-1)}
      />
    </ScrollableDiv>
  )
}

export interface GalleryImage extends Image {
}
function useGalleryImages() {
  const { userInfo } = useAppContext();

  const [ images, setImages ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setImages([])
    
    GalleryApi.getImages({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      fromDate: "",
      toDate: "",
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          const imgs: string[] = result.data;
          setImages(imgs);
        } else {
          setImages([]);
          setError(true);
        }
        setLoading(false);
      },
      fail: () => {
        setImages([]);
        setLoading(false);
        setError(true);
      }
    });
  }, [reload]);

  return { images, loading, error, refresh };
}