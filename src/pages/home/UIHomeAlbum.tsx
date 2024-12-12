import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

import { logedInState, phoneState } from "states";
import { useRecoilValue } from "recoil";

import { Box, Button, Grid, Stack, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { EFamilyTreeApi, FailResponse, ServerResponse } from "utils";

export function UIHomeAlbum() {
  const [ albums, setAlbums ] = React.useState<any[]>([]);

  const navigate = useNavigate();
  const loginedIn = useRecoilValue(logedInState);
  const phoneNumber = useRecoilValue(phoneState);

  React.useEffect(() => {
    if (loginedIn) {
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
      EFamilyTreeApi.getMemberAlbum(phoneNumber, success, fail);
    }
  }, [loginedIn, phoneNumber]);

  const goToImageList = (album: any) => {
    const images = album?.file_anh || [] as any[];
    navigate("/album/image-list", { state: { images } });
  }

  const goToAlbumList = () => {
    navigate("/album");
  }

  const renderAlbums = () => {
    if (!albums.length) {
      return (
        <>
          <Text size="small">{ t("no_album") }</Text>
          <Box flex flexDirection="row" alignItems="center" justifyContent="center" className="button-link">
            <CommonIcon.AddPhoto size={"1rem"}/>
            <Text size="small" className="ml-1"> {t("create")} </Text>
          </Box>
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
