import React from "react";
import { t } from "i18next";
import { Box, Stack, Text } from "zmp-ui";

import { GalleryApi } from "api";
import { useAppContext } from "hooks";
import { ServerResponse } from "server";
import { UIGalleryImages } from "./UIGalleryImages";
import { Loading, SlidingPanel, SlidingPanelOrient } from "components";

interface UIGalleryAlbumsProps {
  getQuantity?: (quantity: number) => void
}
export function UIGalleryAlbums(props: UIGalleryAlbumsProps) {
  let { getQuantity } = props;

  let { albums } = useGalleryAlbums();
  
  let [ show, setShow ] = React.useState(false);
  let [ album, setAlbum ] = React.useState<any>(null);

  if (getQuantity) {
    if (albums.length) getQuantity(albums.length);
  }
  
  const select = (album: any, index: number) => {
    setAlbum(album);
    setShow(true);
  }

  const close = () => { setShow(false) }

  return (
    <>
      <UIGalleryAlbumsContainer albums={albums} onSelectAlbum={select}/>
      <SlidingPanel
        orient={SlidingPanelOrient.BottomToTop}
        visible={show}
        close={close}
        height={window.innerHeight * 0.95} // Height: 95%
        header={album ? `${album.name}` : t("album")}
      >
        {album && album.id ? (
          <UIGalleryImages albumId={album && album.id}/>
        ) : (
          <Loading/>
        )}
      </SlidingPanel>
    </>
  )
}

interface UIGalleryAlbumsContainerProps {
  albums: any[],
  onSelectAlbum: (album: any, index: number) => void;
}
function UIGalleryAlbumsContainer(props: UIGalleryAlbumsContainerProps) {
  let { serverBaseUrl } = useAppContext();
  let { albums, onSelectAlbum } = props;

  if (!albums || !albums.length) return <></>;
  
  let html = [] as React.ReactNode[];

  albums.map((album, index) => {
    html.push(
      <Box 
        key={index} 
        className="button rounded border-primary text-primary mb-2 mt-2" 
        flex flexDirection="row" 
        onClick={() => onSelectAlbum(album, index)}
      >
        <div className="album-left">
          <img 
            src={`${serverBaseUrl}/${album["thumbnail"]}`} 
            className="button rounded"
          />
        </div>
        <Stack className="album-right">
          <Text.Title>{album["name"]}</Text.Title>
          <Text> {`${album["total_images"] || 0} ${t("image_list")}`} </Text>
          <Text> {album["date"]} </Text>
          <Text> {album["address"]} </Text>
          <Text> {album["description"]} </Text>
        </Stack>
      </Box>
    )
  })

  return html;
}

function useGalleryAlbums() {
  let { phoneNumber } = useAppContext();
  let [ albums, setAlbums ] = React.useState<any[]>(new Array());
  let [ reload, setReload ] = React.useState(false);

  const deleteAlbum = (id: number) => {}
  const addAlbum = (data: any) => {}
  const refresh = () => { setReload(!reload); }

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        setAlbums(result.data);
      }
    }
    GalleryApi.getAlbums(phoneNumber, success);
  }, [ reload ] ); 

  return { albums, deleteAlbum, addAlbum, refresh }
}