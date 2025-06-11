import React from "react";
import { t } from "i18next";
import { Button, Grid, Sheet, Text } from "zmp-ui";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { GalleryApi } from "api";
import { ServerResponse, PageContextProps } from "types";
import { useAppContext, usePageContext, useRouteNavigate } from "hooks";
import { CommonIcon, Header, Loading, MarginToolbar, Retry, Toolbar } from "components";

import { AlbumForm, UICreateAlbum } from "./UICreateAlbum";

const albums = [
  {
    "id": 10,
    "thumbnailPath": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    "albumType": "clan",
    "date": "10/12/2024@03:00:00",
    "address": "Nhà thờ họ",
    "eventId": 1,
    "description": "giỗ tổ 2023",
    "totalImages": 11
  },
  {
    "id": 11,
    "thumbnailPath": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    "albumType": "clan",
    "date": "10/12/2024@03:00:00",
    "address": "Nhà thờ họ",
    "eventId": 1,
    "description": "giỗ tổ 2023",
    "totalImages": 11
  },
]

function useSearchAlbums() {
  const { userInfo } = useAppContext();

  const [ albums, setAlbums ] = React.useState<AlbumForm[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  const mapAlbums = (albums: any[]) => {
    let results: AlbumForm[] = [];
    for (const album of albums) {
      results.push({
        id:             album.id,
        thumbnailPath:  album.thumbnail,
        description:    album.description,
        albumType:      album.album_type,
        date:           album.date,
      })
    }
    return results;
  }
    

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setAlbums([])

    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "success") {
        setError(false);
        const remapAlbums: AlbumForm[] = mapAlbums(result.data);
        setAlbums(remapAlbums);
      } else {
        setError(true);
        setAlbums([]);
      }
    };
    const fail = () => {
      setLoading(false);
      setError(true);
    }
    GalleryApi.searchAlbums(userInfo.id, userInfo.clanId, success, fail);
  }, [reload]);

  return { albums, loading, error, refresh };
}

interface UIAlbumsProps extends PageContextProps {}
export function UIAlbums(props: UIAlbumsProps) {
  const { permissions } = props;
  const { loading, error, refresh } = useSearchAlbums();
  const { goTo, goHome } = useRouteNavigate();

  const [ create, setCreate ] = React.useState<boolean>(false);

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (!albums.length) {
      return <Retry title={t("Không tìm thấy album")} onClick={refresh}/>
    } else if (error) {
      return <Retry title={t("Không tìm thấy album")} onClick={refresh}/>
    } else {
      return (
        <UIAlbumsGrid albums={albums} refresh={refresh}/>
      )
    }
  }

  return (
    <>
      <Header title={t("gallery")} onBack={goHome}/>

      <div>
        {renderContainer()}

        <MarginToolbar/>
        <Toolbar justify="start">
          {permissions.canModerate && (
            <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={() => setCreate(true)}>
              {t("add")}
            </Button>
          )}
          <Button size="small" prefixIcon={<CommonIcon.Photos/>} onClick={() => goTo({ path: "gallery/images" })}>
            {t("tất cả ảnh")}
          </Button>
        </Toolbar>

        <Sheet
          title={t("Tạo Album")}
          visible={create} onClose={() => setCreate(false)}
          height={"80vh"}
        >
          <UICreateAlbum 
            onClose={() => setCreate(false)}
            onReloadParent={() => refresh()}
          />
        </Sheet>
      </div>
    </>
  )
}

interface UIAlbumsGridProps {
  albums: any[];
  refresh: () => void;
}
function UIAlbumsGrid(props: UIAlbumsGridProps) {
  const { albums, refresh } = props;
  const { serverBaseUrl } = useAppContext();
  const { permissions } = usePageContext();
  const { goTo } = useRouteNavigate();

  const albumCards = () => {
    const html: React.ReactNode[] = albums.map((album: AlbumForm, index: number) => (
      <div key={`album-${index}`} className="flex-v box-shadow rounded p-3 button">
        <PhotoProvider maskOpacity={0.5} maskClosable pullClosable bannerVisible={false}>
          <PhotoView src={`${serverBaseUrl}/${album.thumbnailPath}`}>
            <img src={`${serverBaseUrl}/${album.thumbnailPath}`} alt={album.description} className="rounded object-cover w-full h-40"/>
          </PhotoView>
          <div 
            onClick={() => goTo({
              path: "gallery/album",
              belongings: {
                album: album,
                permissions: permissions
              }
            })}
            className="center flex-v"
          >
            <Text.Title size="normal"> {album.description} </Text.Title>
          </div>
        </PhotoProvider>
      </div>
    ))
    return html;
  }

  return (
    <Grid className="p-2" columnCount={1} rowSpace="1rem">
      {albumCards()}
    </Grid>
  )
}