import React from "react";

import { Gallery } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails, Counter } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { GalleryApi } from "api";
import { useAppContext } from "hooks";
import { ServerResponse } from "server";

interface UIGalleryImagesProps {
  getQuantity?: (quantity: number) => void;
}
export function UIGalleryImages({ getQuantity }: UIGalleryImagesProps) {
  const { images, refresh } = useGalleryImages();
  const [index, setIndex] = React.useState(-1);

  React.useEffect(() => {
    if (getQuantity) {
      getQuantity(images.length);
    }
  }, [images, getQuantity]);

  return (
    <div>
      <Gallery 
        images={images} 
        onClick={(index) => setIndex(index)} 
        enableImageSelection={false} 
      />
      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Zoom, Thumbnails, Counter]}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 50,
        }}
      />
    </div>
  );
}

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  imageFit: "contain" | "cover";
}

export function useGalleryImages() {
  const { userInfo, serverBaseUrl } = useAppContext();
  const [images, setImages] = React.useState<GalleryImage[]>([]);
  const [reload, setReload] = React.useState(false);

  const refresh = () => setReload(!reload);

  const remapImgs = (images: string[] | any) => 
    images.map((imgPath: string) => ({
      src: `${serverBaseUrl}/${imgPath}`,
      width: 320,
      height: 240,
      imageFit: "cover",
  }));

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const imgs: string[] = result.data;
        setImages(remapImgs(imgs));
      }
    };

    GalleryApi.getImages(userInfo.id, userInfo.clanId, "", "", success);
  }, [reload]);

  return { images, refresh };
}