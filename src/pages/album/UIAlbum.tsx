import React from "react";
import { useNavigate } from "react-router-dom";
import { FcAddImage } from "react-icons/fc";
import { t } from "i18next";
import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { Box, Grid, Stack, Text } from "zmp-ui";
import { openMediaPicker } from "zmp-sdk/apis";
import { FailResponse } from "utils/type";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";

import { Header } from "components";

function UIAlbum() {
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

    const success = (result: any[] | string) => {
      // result should be a list of image urls
      if (typeof result === 'string') {
        console.warn(result);
      } else {
        setAlbums(result["albums"] || [] as any[]);
      }
    }

    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
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
      <Box flex justifyContent="center">
        <FcAddImage size={"4.5em"} className="button" onClick={addImage} />
      </Box>
    )
  }

  return (
    <Grid columnCount={1} columnSpace="0.5rem" rowSpace="0.5rem">
      {/* {albums.length > 0 ? renderAlbums() : renderAddButton()} */}
      {renderAlbums()}
    </Grid>
  )
}

export default UIAlbum;