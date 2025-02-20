import React from "react";
import { t } from "i18next";
import { Button, Grid, Sheet } from "zmp-ui";

import { GalleryApi } from "api";
import { useAppContext } from "hooks";
import { Card, CommonIcon, Info, Loading } from "components";

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

const images = [
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
  "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
]

export function UIGalleryAlbums() {
  const { serverBaseUrl } = useAppContext();
  const { albums, error, loading, refresh } = useGalleryAlbums();

  const [ create, setCreate ] = React.useState<boolean>(false);
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

  if (loading) return <Loading/>
  if (error) return (
    <div>
      <Info className="text-base" title={t("Không có album")}/>
      {/* Create Album */}
      <Sheet
        title={t("Tạo Album")}
        visible={create} onClose={() => setCreate(false)}
        height={"80vh"}
      >
        <UICreateAlbum 
          onClose={() => setSelect(null)}
          onReloadParent={() => refresh()}
        />
      </Sheet>
      <div style={{ position: "absolute", bottom: 20, right: 10 }}>
        <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={() => setCreate(true)}>
          {t("add")}
        </Button>
      </div>
    </div>
  )
  else return (
    <div>
      <Grid className="p-2" columnCount={2} rowSpace="0.5rem" columnSpace="0.5rem">
        {albumCards}
      </Grid>

      <div style={{ position: "absolute", bottom: 20, right: 10 }}>
        <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={() => setCreate(true)}>
          {t("add")}
        </Button>
      </div>

      {/* Create Album */}
      <Sheet
        title={t("Tạo Album")}
        visible={create} onClose={() => setCreate(false)}
        height={"80vh"}
      >
        <UICreateAlbum 
          onClose={() => setSelect(null)}
          onReloadParent={() => refresh()}
        />
      </Sheet>

      {/* Album Detail */}
      <Sheet
        title={t("Chi Tiết Album")}
        visible={select ? true : false}  onClose={() => setSelect(null)}
        height={"85vh"}
      >
        <UIGalleryAlbumDetail 
          album={select} 
          onClose={() => setSelect(null)}
          onReloadParent={() => refresh()}
        />
      </Sheet>
    </div>
  );
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