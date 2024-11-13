import React from "react";
import { t } from "i18next";
import { Box, Grid, Stack, Text, useNavigate } from "zmp-ui";
import { logedInState, phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse } from "utils/Interface";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";

import CommonIcons from "components/icon/common";
import UIDivider from "components/common/UIDivider";

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

  const renderAlbums = () => {
    if (!albums.length) {
      return (
        <Text size="small">{ t("no_album") }</Text>
      )
    } else {
      let html = [] as React.ReactNode[];
      for (let i = 1; i <= albums.length; i++) {
        if (i === 3) break;
        const album = albums[i - 1];
        html.push(
          <Box 
            key={`album-${i}`} 
            className="button rounded border" 
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
              <Text.Title>{album.name}</Text.Title>
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
      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title className="text-capitalize"> {t("album")} </Text.Title>
        
      </Box>
      <UIDivider />
      {renderAlbums()}
    </Stack>
  );
}
