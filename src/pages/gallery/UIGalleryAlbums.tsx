import React from "react";
import { t } from "i18next";
import { Button, Grid, Sheet } from "zmp-ui";

import { GalleryApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { Card, CommonIcon, Header, Info, Loading } from "components";

import { ServerResponse } from "types/server";

import { AlbumForm, UICreateAlbum } from "./UICreateAlbum";
import { UIGalleryAlbumDetail } from "./UIGalleryAlbumDetails";

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
  const { albums, error, loading, refresh } = useGalleryAlbums();
  const { goTo } = useRouteNavigate();

  const [ create, setCreate ] = React.useState<boolean>(false);

  const goToImages = () => {
    goTo({ path: "gallery/images" });
  }

  const renderFooter = () => {
    return (
      <div className="flex-v" style={{ position: "absolute", bottom: 20, right: 10 }}>
        <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={() => setCreate(true)}>
          {t("add")}
        </Button>
        <Button size="small" prefixIcon={<CommonIcon.Photo/>} onClick={goToImages}>
          {t("tất cả ảnh")}
        </Button>
      </div>
    )
  }

  const renderContainer = () => {

    const renderErrorContainer = () => {
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
      return renderErrorContainer()
    } else if (error) {
      return renderErrorContainer()
    } else {
      return (
        <UIGalleryAlbumsContainer albums={albums} refresh={refresh}/>
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

interface UIGalleryAlbumsContainerProps {
  albums: any[];
  refresh: () => void;
}
function UIGalleryAlbumsContainer(props: UIGalleryAlbumsContainerProps) {
  const { albums, refresh } = props;
  const { serverBaseUrl } = useAppContext();

  const [ select, setSelect ] = React.useState<AlbumForm | null>(null);

  const albumCards = React.useMemo(() => {
    return albums.map((album, index) => (
      <Card
        key={`album-${index}`}
        onClick={() => setSelect({
          id: album.id,
          name: album.name,
          thumbnailPath: album.thumbnail,
          description: album.description,
          eventId: album.event_id,
        } as AlbumForm)}
        title={album.name}  
        src={`${serverBaseUrl}/${album.thumbnail}`}
        className="button box-shadow rounded p-2" height={"auto"}
      />
    ))
  }, [albums]);

  return (
    <>
      <Grid className="p-2" columnCount={2} rowSpace="0.5rem" columnSpace="0.5rem">
        {albumCards}
      </Grid>

      <Sheet
        title={t("Chi Tiết Album")}
        visible={select ? true : false}  
        onClose={() => setSelect(null)}
        height={"85vh"}
      >
        <UIGalleryAlbumDetail 
          album={select} 
          onClose={() => setSelect(null)}
          onReloadParent={() => refresh()}
        />
      </Sheet>
    </>
  )
}

function useGalleryAlbums() {
  const { userInfo } = useAppContext();

  const [ albums, setAlbums ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setAlbums([])

    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "success") {
        setError(false);
        setAlbums(result.data);
      } else {
        setError(true);
        setAlbums([]);
      }
    };
    const fail = () => {
      setLoading(false);
      setError(true);
    }
    GalleryApi.getAlbums(userInfo.id, userInfo.clanId, success, fail);
  }, [reload]);

  return { albums, loading, error, refresh };
}