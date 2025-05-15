import React from "react";
import { t } from "i18next";
import { Button, Grid, Sheet } from "zmp-ui";

import { GalleryApi } from "api";
import { ServerResponse } from "types/server";
import { useAppContext, useRouteNavigate } from "hooks";
import { Card, CommonIcon, Header, Info, Loading } from "components";

import { AlbumForm, UICreateAlbum } from "./UICreateAlbum";

const albums = [
  {
    "id": 10,
    "name": "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    "thumbnail": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    "album_type": "clan",
    "date": "10/12/2024@03:00:00",
    "address": "Nhà thờ họ",
    "event_id": 1,
    "description": "giỗ tổ 2023",
    "total_images": 11
  },
  {
    "id": 11,
    "name": "lorem ipsum",
    "thumbnail": "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
    "album_type": "clan",
    "date": "10/12/2024@03:00:00",
    "address": "Nhà thờ họ",
    "event_id": 1,
    "description": "giỗ tổ 2023",
    "total_images": 11
  }
]

export function UIGalleryAlbums() {
  const { error, loading, refresh } = useGalleryAlbums();
  const { goTo } = useRouteNavigate();

  const [ create, setCreate ] = React.useState<boolean>(false);

  const renderFooter = () => {
    return (
      <div className="flex-v" style={{ position: "absolute", bottom: 20, right: 10 }}>
        <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={() => setCreate(true)}>
          {t("add")}
        </Button>
        <Button size="small" prefixIcon={<CommonIcon.Photo/>} onClick={() => goTo({ path: "gallery/images" })}>
          {t("tất cả ảnh")}
        </Button>
      </div>
    )
  }

  const renderContainer = () => {
    return (
      <UIGalleryAlbumsGrid albums={albums} refresh={refresh}/>
    )

    const renderError = () => {
      return (
        <div className="flex-v">
          <Info title={t("Chưa có dữ liệu")}/>
          <div className="center">
            <Button size="small" prefixIcon={<CommonIcon.Reload size={"1rem"}/>} onClick={() => refresh()}>
              {t("retry")}
            </Button>
          </div>
        </div>
      )
    }

    if (loading) {
      return <Loading/>
    } else if (!albums.length) {
      return renderError()
    } else if (error) {
      return renderError()
    } else {
      return (
        <UIGalleryAlbumsGrid albums={albums} refresh={refresh}/>
      )
    }
  }

  return (
    <>
      <Header title={t("gallery")}/>

      <div>

        {renderContainer()}

        {renderFooter()}

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

interface UIGalleryAlbumsGridProps {
  albums: any[];
  refresh: () => void;
}
function UIGalleryAlbumsGrid(props: UIGalleryAlbumsGridProps) {
  const { albums, refresh } = props;
  const { serverBaseUrl } = useAppContext();
  const { goTo } = useRouteNavigate();

  const albumCards = React.useMemo(() => {
    return albums.map((album: AlbumForm, index: number) => (
      <Card
        key={`album-${index}`}
        onClick={() => {
          goTo({ path: "gallery/album", belongings: { album: album } })
        }}
        title={album.name}
        src={`${serverBaseUrl}/${album.thumbnailPath}`}
        className="button box-shadow rounded p-2" height={"auto"}
      />
    ))
  }, [albums]);

  return (
    <Grid className="p-2" columnCount={1} rowSpace="1rem">
      {albumCards}
    </Grid>
  )
}

function useGalleryAlbums() {
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
        name:           album.name,
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