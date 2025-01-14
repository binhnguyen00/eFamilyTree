import React from "react";
import { t } from "i18next";
import { Grid } from "zmp-ui";
import { Gallery } from "react-grid-gallery";

import { GalleryApi } from "api";
import { StyleUtils } from "utils";
import { useAppContext } from "hooks";
import { Card, Loading, SlidingPanel, SlidingPanelOrient } from "components";

import { ServerResponse } from "types/server";

import { GalleryImage } from "./UIGalleryImages";

import Lightbox from "yet-another-react-lightbox";
import { Zoom } from "yet-another-react-lightbox/plugins";

export function UIGalleryAlbums() {
  const { albums } = useGalleryAlbums();
  const { userInfo, serverBaseUrl } = useAppContext();

  const [show, setShow] = React.useState(false);
  const [albumId, setAlbumId] = React.useState<number | null>(null); // Store albumId only

  const selectAlbum = (album: any) => {
    setShow(true);
    setAlbumId(album.id);
  };

  const closePanel = () => {
    setShow(false);
    setAlbumId(null);
  };

  if (!albums || !albums.length) return <></>;

  return (
    <>
      <Grid className="p-2" columnCount={2} rowSpace="0.5rem" columnSpace="0.5rem">
        {albums.map((album, index) => (
          <Card
            key={`album-${index}`}
            onClick={() => selectAlbum(album)}
            src={`${serverBaseUrl}/${album.thumbnail}`}
            height={"auto"}
            title={album.name}
            className="button bg-secondary text-primary"
          />
        ))}
      </Grid>
      <SlidingPanel
        orient={SlidingPanelOrient.BottomToTop}
        visible={show}
        close={closePanel}
        height={StyleUtils.calComponentRemainingHeight(0)}
        header={
          <p style={{ fontSize: "1.2rem" }}>
            {albums.find((a) => a.id === albumId)?.name || t("album")}
          </p>
        }
      >
        {albumId ? (
          <UIGalleryImagesByAlbum albumId={albumId} userInfo={userInfo} serverBaseUrl={serverBaseUrl}/>
        ) : (
          <Loading />
        )}
      </SlidingPanel>
    </>
  );
}
function useGalleryAlbums() {
  const { userInfo } = useAppContext();
  const [albums, setAlbums] = React.useState<any[]>([]);
  const [reload, setReload] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        setAlbums(result.data);
      }
    };
    GalleryApi.getAlbums(userInfo.id, userInfo.clanId, success);
  }, [reload]);

  return { albums, refresh };
}


// ========================
// IMAGE BY ALBUM ID
// ========================
interface UIGalleryImagesProps {
  albumId: number;
  userInfo: any;
  serverBaseUrl: string
}

function UIGalleryImagesByAlbum({ albumId, userInfo, serverBaseUrl }: UIGalleryImagesProps) {
  const [ images, setImages ] = React.useState<GalleryImage[]>([]);
  const [ index, setIndex ] = React.useState(-1);

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
    GalleryApi.getImagesByAlbum(userInfo.id, userInfo.clanId, albumId, success);
  }, [ albumId ]);

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
        plugins={[Zoom]}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 50,
        }}
      />
    </div>
  );
}