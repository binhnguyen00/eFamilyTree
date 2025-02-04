import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Text } from "zmp-ui";
import { Gallery } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails, Counter } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { ZmpSDK } from "utils";
import { MemorialMapApi } from "api";
import { useBeanObserver } from "hooks";
import { BeanObserver, CommonIcon, Loading, SizedBox, SlidingPanel, SlidingPanelOrient, useAppContext } from "components";
import { FailResponse, ServerResponse } from "types/server";
import { GalleryImage } from "pages/gallery/UIGalleryImages";

interface UIMemorialLocationProps {
  id: number;
  visible: boolean;
  onClose: () => void;
}
export function UIMemorialLocation({ id, visible, onClose }: UIMemorialLocationProps) {
  const { info, loading } = useQueryInfo(id)

  const [ container, setContainer ] = React.useState<React.ReactNode>(<Loading/>);

  React.useEffect(() => {
    if (!loading) setContainer(
      <SlidingPanel
        orient={SlidingPanelOrient.LeftToRight} 
        visible={visible} 
        className="bg-white pb-3"
        header={"Di Tích"}      
        close={onClose}
      >
        <Form info={info}/>
      </SlidingPanel>
    )
  }, [ loading, info ])
  
  return container;
}

function InputLabel({ text, required }: { text: string, required?: boolean }) {
  return <span className="text-primary"> {`${t(text)} ${required ? "*" : ""}`} </span>
}

type Location = {
  name: string;
  description: string;
  lat: string;
  lng: string;
  images: string[];
  clanId: number;
}

function Form({ info }: { info: any }) {
  const observer = useBeanObserver(info);

  const success = (res: ServerResponse) => {

  }
  const fail = (res: FailResponse) => {

  }

  const onDelete = () => {

  }

  return (
    <div className="flex-v" style={{ height: "70vh" }}>
      <>
        <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>
        <Input 
          size="small" label={<InputLabel text="Tên Di Tích" required/>}
          value={observer.getBean().name} name="name"
          onChange={observer.watch}
        />
        <Input.TextArea
          size="large" label={<InputLabel text="Mô Tả"/>}
          value={observer.getBean().description} name="description"
          onChange={(e) => observer.update("description", e.target.value)}
        />
        <ImageSelector observer={observer}/>
      </>

      <>
        <Text.Title className="text-capitalize text-primary py-2"> {t("utilities")} </Text.Title>
        <Button variant="primary" size="small" style={{ width: "fit-content" }} onClick={onDelete} prefixIcon={<CommonIcon.Trash/>}>
          {t("delete")}
        </Button>
      </>
    </div>
  )
}

interface ImageSelectorProps {
  observer: BeanObserver<Location>;
}
function ImageSelector({ observer }: ImageSelectorProps) {
  const [ images, setImages ] = React.useState<GalleryImage[]>([]);
  const [ index, setIndex ] = React.useState(-1);

  const { serverBaseUrl } = useAppContext();

  const remapImgs = (images: string[] | any) => {
    if (!images) return [];
    return images.map((imgPath: string) => ({
      src: `${serverBaseUrl}/${imgPath}`,
      width: 100,
      height: 100,
      imageFit: "contain",
    }));
  }

  React.useEffect(() => {
    const imgs = remapImgs(observer.getBean().images);
    setImages(imgs)
  }, [])

  const Images = () => {
    if (!images.length) return;
    return (
      <>
        <Gallery 
          images={images} 
          onClick={(index) => setIndex(index)} 
          enableImageSelection={false} 
          rowHeight={100}
        />
        <Lightbox
          slides={images}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          plugins={[Zoom, Thumbnails, Counter]}
          zoom={{
            scrollToZoom: true,
            maxZoomPixelRatio: 50,
          }}
        />
      </>
    )
  }

  return (
    <div className="flex-v flex-grow-0">
      <label> {"Ảnh"} </label>
      <Images/>
    </div>
  )
}

// ===================================
// Query
// ===================================
function useQueryInfo(id: number) {
  const { userInfo } = useAppContext();
  const [ info, setInfo ] = React.useState<any>({});
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error(result.message);
      } else {
        const data = result.data as any;
        setInfo(data);
      }
    }
    const fail = (error: any) => setLoading(false);
    MemorialMapApi.get(userInfo.id, userInfo.clanId, id, success, fail)
  }, [ id ]);

  return {
    info: info,
    loading: loading
  }
}