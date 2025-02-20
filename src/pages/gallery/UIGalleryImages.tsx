import React from "react";

import { Gallery, Image } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { GalleryApi } from "api";
import { useAppContext } from "hooks";

import { ServerResponse } from "types/server";
import { CommonIcon, Info, Loading } from "components";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";
import { UICreateAlbum } from "./UICreateAlbum";

interface UIGalleryImagesProps {
}
export function UIGalleryImages(props: UIGalleryImagesProps) {
  const {  } = props;
  const { serverBaseUrl } = useAppContext();
  const { images, loading, error, refresh } = useGalleryImages();

  const [ index, setIndex ] = React.useState(-1);
  const [ create, setCreate ] = React.useState<boolean>(false);

  const remapImages: GalleryImage[] = React.useMemo(() => {
    return images.map((imgPath: string) => ({
      src: `${serverBaseUrl}/${imgPath}`,
      width: 150,
      height: 150,
      imageFit: "contain",
    }));
  }, [ images ]);

  if (loading) return <Loading/>
  if (!images.length) return (
    <div className="flex-v flex-grow-0">
      <Info 
        className="text-base py-3" 
        title={t("Không có ảnh")} 
        message={t("Hãy thêm album để thêm ảnh")}
      />
      {!error && (
        <div className="center">
          <Button size="small" prefixIcon={<CommonIcon.AddPhoto/>} onClick={() => setCreate(true)}>
            {t("Thêm")}
          </Button>
        </div>
      )}
      {/* Create Album */}
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
  )
  else return (
    <div>
      <Gallery 
        images={remapImages} 
        onClick={(index) => setIndex(index)} 
        enableImageSelection={false} 
        rowHeight={150}
      />
      <Lightbox
        slides={remapImages}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Zoom, Thumbnails]}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 50,
        }}
      />
    </div>
  );
}

export interface GalleryImage extends Image {
}
function useGalleryImages() {
  const { userInfo } = useAppContext();

  const [ images, setImages ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setImages([])
    
    GalleryApi.getImages({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      fromDate: "",
      toDate: "",
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          const imgs: string[] = result.data;
          setImages(imgs);
        } else {
          setImages([]);
          setError(true);
        }
        setLoading(false);
      },
      fail: () => {
        setImages([]);
        setLoading(false);
        setError(true);
      }
    });
  }, [reload]);

  return { images, loading, error, refresh };
}