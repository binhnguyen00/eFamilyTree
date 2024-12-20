import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Grid, Stack, Text } from "zmp-ui";

import { AlbumApi } from "api";
import { FailResponse, ServerResponse } from "server";
import { AppContext, CommonIcon } from "components";

export function UIHomeAlbum() {
  const navigate = useNavigate();
  const [ albums, setAlbums ] = React.useState<any[]>([]);
  const { logedIn, phoneNumber } = React.useContext(AppContext);

  React.useEffect(() => {
    if (logedIn) {
      const success = (result: ServerResponse) => {
        if (result.status === "error") {
          console.error("UIHomeAlbum:\n\t", result.message);
        } else {
          const data = result.data as any[];
          setAlbums(data);
        }
      };
      const fail = (error: FailResponse) => {
        console.error("UIHomeAlbum:\n\t", error.stackTrace);
      }
      AlbumApi.getAlbums(phoneNumber, success, fail);
    }
  }, [ logedIn ]);

  const goToImageList = (album: any) => {
    const images = album["image"] || [] as any[];
    navigate("/album/images", { state: { images } });
  }

  const goToAlbumList = () => {
    navigate("/album");
  }

  const renderAlbums = () => {
    if (!albums.length) {
      return (
        <>
          <Text size="small">{ t("no_album") }</Text>
        </>
      )
    } else {
      let html = [] as React.ReactNode[];
      for (let i = 1; i <= albums.length; i++) {
        if (i === 3) break;
        const album = albums[i - 1];
        html.push(
          <Box 
            key={`album-${i}`} 
            className="button rounded border-secondary bg-secondary text-primary" 
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
              <Text.Title size="small">{album.name}</Text.Title>
              <Text>{`${album["image"].length || 0} ${t("image_list")}`}</Text>
              <Text>{album["address"]}</Text>
              <Text>{album["desciption"]}</Text>
            </Stack>
          </Box>
        )
      }
      return (
        <Grid columnCount={1} columnSpace="0.5rem" rowSpace="0.5rem">
          {html}
        </Grid>
      )
    }
  };

  return (
    <Stack space="0.5rem">

      <Box flex flexDirection="row" justifyContent="space-between" >
        <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("album")} </Text.Title>
        {albums.length ? (
          <Box flex flexDirection="row" alignItems="center" alignContent="center" className="button">
            <Button size="small" variant="secondary" suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} onClick={goToAlbumList}>
              <Text> {t("more")} </Text>
            </Button>
          </Box>
        ) : null}
      </Box>

      {renderAlbums()}

    </Stack>
  );
}
