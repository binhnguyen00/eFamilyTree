import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { phoneState } from "states";

import { openMediaPicker } from "zmp-sdk/apis";
import { Box, Grid, Stack, Text } from "zmp-ui";

import { Header, SizedBox } from "components";
import { EFamilyTreeApi, FailResponse, ServerResponse } from "utils";

export function UIAlbum() {
  return (
    <div className="container">
      <Header title={t("album")}/>
      
      <UIAlbumList />
    </div>
  )
}

function UIAlbumList() {
  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);
  const [ reload, setReload ] = React.useState(false);
  const [ albums, setAlbums ] = React.useState<any[]>([]);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "error") {
        console.error("UIAlbumList:\n\t", result.message);
      } else {
        const data = result.data as any[];
        setAlbums(data);
      }
    }
    const fail = (error: FailResponse) => {
      console.error("UIAlbumList:\n\t", error.stackTrace);
    }
    EFamilyTreeApi.getMemberAlbum(phoneNumber, success, fail);
  }, [ reload ]);

  const goToImageList = (album: any) => {
    const images = album?.file_anh || [] as any[];
    navigate("/album/image-list", { state: { images } });
  }

  const renderAlbums = () => {
    if (!albums) return;
    
    let html = [] as React.ReactNode[];

    albums.map((album, index) => {
      html.push(
        <Box 
          key={index} 
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
    })

    html.push(renderAddButton());

    return html;
  }

  const renderAddButton = () => {
    const addImage = () => {
      openMediaPicker({
        serverUploadUrl: "",
        type: "photo",
          success: (res) => {
            const { data } = res;
            const result = JSON.parse(data);
            console.log(result);
          },
          fail: (error) => {
            console.log(error);
          },
      })
    }

    return (
      <Box flex flexDirection="row" justifyContent="center">
        <SizedBox width={"4.5em"} height={"4.5em"} border className="button" onClick={addImage}>
          <div> {"+"} </div>
        </SizedBox>
      </Box>
    )
  }

  return (
    <Grid columnCount={1} columnSpace="0.5rem" rowSpace="0.5rem">
      {renderAlbums()}
    </Grid>
  )
}