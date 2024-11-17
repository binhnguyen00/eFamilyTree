import React from "react";
import { t } from "i18next";
import { Box, Grid, Stack, Text, useNavigate } from "zmp-ui";
import { logedInState, phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse } from "utils/Interface";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CommonIcon } from "components";

export default function UIHomeAlbum() {
  const [albums, setAlbums] = React.useState<any[]>([]);

  const navigate = useNavigate();
  const loginedIn = useRecoilValue(logedInState);
  const phoneNumber = useRecoilValue(phoneState);

  React.useEffect(() => {
    if (loginedIn) {
      const success = (result: any[] | string) => {
        if (typeof result === 'string') console.warn(result);
        else setAlbums(result["albums"] || []);
      };
      const fail = (error: FailResponse) => console.error(error.stackTrace);
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
            className="button rounded border bg-blur" 
            flex flexDirection="row" 
            onClick={() => goToImageList(album)}
          >
            <div className="album-left">
              <img 
                src={`https://${album.avatar}`} 
                alt={album.name} 
                className="button rounded"
              />
            </div>
            <Stack className="album-right">
              <Text.Title size="small">{album.name}</Text.Title>
              <Text>{album.file_anh.length || 0}</Text>
              <Text>{album.thoi_gian}</Text>
              <Text>{album.dia_diem}</Text>
              <Text>{album.mo_ta}</Text>
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
        <Text.Title size="xLarge" className="text-capitalize"> {t("album")} </Text.Title>
        {albums.length ? (
          <Box flex flexDirection="row" alignItems="center" className="button" onClick={goToAlbumList}>
            <Text size="small"> {t("more")} </Text>
            <CommonIcon.ChevonRight size={"1rem"}/>
          </Box>
        ) : null}
      </Box>

      {renderAlbums()}

    </Stack>
  );
}
