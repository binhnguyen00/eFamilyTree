import React from "react";
import { t } from "i18next";
import { Box, Grid, Stack, Text } from "zmp-ui";

import { AppContext, Header, Info, Loading } from "components";
import { AlbumApi } from "api"; 
import { FailResponse, ServerResponse } from "server";
import { useRouteNavigate } from "hooks";

export function UIAlbum() {
  return (
    <div className="container">
      <Header title={t("album")}/>
      
      <UIAlbumList />
    </div>
  )
}

function UIAlbumList() {
  const { goTo } = useRouteNavigate();
  const { phoneNumber } = React.useContext(AppContext);

  const [ reload, setReload ] = React.useState(false);
  const [ albums, setAlbums ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error("UIAlbumList:\n\t", result.message);
      } else {
        const data = result.data as any[];
        setAlbums(data);
      }
    }
    const fail = (error: FailResponse) => {
      setLoading(false);
      console.error("UIAlbumList:\n\t", error.stackTrace);
    }
    AlbumApi.getAlbums(phoneNumber, success, fail);
  }, [ reload ]);

  const goToImageList = (album: any) => {
    const images: any[] = album["image"] || [];
    goTo("album/images", { images });
  }

  const renderAlbums = () => {
    if (!albums) return <></>;
    
    let html = [] as React.ReactNode[];

    albums.map((album, index) => {
      html.push(
        <Box 
          key={index} 
          className="button rounded border bg-secondary text-primary" 
          flex flexDirection="row" 
          onClick={() => goToImageList(album)}
        >
          <div className="album-left">
            <img 
              src={`https://${album["avatar"]}`} 
              alt={album.name} 
              className="button rounded"
            />
          </div>
          <Stack className="album-right">
            <Text.Title>{album["name"]}</Text.Title>
            <Text> {album["image"].length || 0} </Text>
            <Text> {album["date"]} </Text>
            <Text> {album["address"]} </Text>
            <Text> {album["description"]} </Text>
          </Stack>
        </Box>
      )
    })

    return html;
  }

  if (albums.length === 0) {
    if (loading)
      return <Loading message={t("loading")}/>
    else 
      return <Info title={t("no_album")}/>
  } else return (
    <Grid columnCount={1} columnSpace="0.5rem" rowSpace="0.5rem">
      {renderAlbums()}
    </Grid>
  )
}