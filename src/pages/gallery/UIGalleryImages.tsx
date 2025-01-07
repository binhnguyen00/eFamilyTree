import React from "react";

import { Gallery } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails, Counter } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { GalleryApi } from "api";
import { useAppContext } from "hooks";
import { ServerResponse } from "server";
import { ScrollableDiv } from "components";

interface UIGalleryImagesProps {
  albumId?: number;
  getQuantity?: (quantity: number) => void;
}
export function UIGalleryImages(props: UIGalleryImagesProps) { 
  let { albumId, getQuantity } = props;

  let [ to, setToDate ] = React.useState<string>("");
  let [ from, setFromDate ] = React.useState<string>("");
  let { images } = useGalleryImages(from, to, albumId);

  if (getQuantity) {
    if (images.length) getQuantity(images.length);
  }

  let [ index, setIndex ] = React.useState(-1);

  const select = (index: number, item: any) => { setIndex(index); }
  const close = () => setIndex(-1);

  return (
    <ScrollableDiv height={images.length ? "auto" : "100vh"} width={"auto"} className="bg-white">
      <Gallery 
        images={images}
        onClick={select}
        enableImageSelection={false}
      />
      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={close}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 50,
        }}
        plugins={[Zoom, Thumbnails, Counter]}
      />
    </ScrollableDiv>
  )
}

interface GalleryImage {
  src: string;
  width: number;
  height: number;
  imageFit: "contain" | "cover";
}
export function useGalleryImages(from: string = "", to: string = "", albumId?: number) {
  let { userInfo, serverBaseUrl } = useAppContext();
  let [ images, setImages ] = React.useState<GalleryImage[]>([]);
  let [ reload, setReload ] = React.useState(false);

  const deleteImage = (id: number) => {}
  const addImage = (data: any) => {}

  const refresh = () => { setReload(!reload); }

  const remapImgs = (images: string[]) => {
    return images.map((imgPath: string) => {
      return {
        src: `${serverBaseUrl}/${imgPath}`,
        width: 320,
        height: 240,
        imageFit: "cover",
      } as GalleryImage
    })
  }

  const getImages = () => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const remap = remapImgs(result.data);
        setImages(remap);
      }
    }
    GalleryApi.getImages(userInfo.id, userInfo.clanId, from, to, success);
  }

  const getImagesByAlbum = (albumId: number) => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const remap = remapImgs(result.data);
        setImages(remap);
      }
    }
    GalleryApi.getImagesByAlbum(userInfo.id, userInfo.clanId, albumId, success);
  }

  React.useEffect(() => {
    if (albumId) 
      getImagesByAlbum(albumId);
    else 
      getImages();
  }, [ reload ])

  return { images, deleteImage, addImage, refresh }
}