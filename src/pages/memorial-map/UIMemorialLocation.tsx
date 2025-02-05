import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";
import { Gallery } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails, Counter } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { FamilyTreeApi, MemorialMapApi } from "api";
import { useNotification } from "hooks";
import { 
  BeanObserver, CommonIcon, Loading, Marker, Selection, 
  SlidingPanel, SlidingPanelOrient, useAppContext } from "components";
import { FailResponse, ServerResponse } from "types/server";
import { GalleryImage } from "pages/gallery/UIGalleryImages";

interface UIMemorialLocationProps {
  id: number;
  visible: boolean;
  onClose: () => void;
  onRemove: (marker: Marker) => void;
}
export function UIMemorialLocation({ id, visible, onClose, onRemove }: UIMemorialLocationProps) {
  const { bean, setBean, loading, deadMembers } = useQueryInfo(id)

  const { userInfo, serverBaseUrl } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const [ container, setContainer ] = React.useState<React.ReactNode>(<Loading/>);

  const onDelete = () => {
    const success = (res: ServerResponse) => {
      if (res.status === "error") fail(null as any);
      successToast(`${t("delete")} ${t("success")}`);
      onClose();
      onRemove({
        id: bean.id,
        label: bean.name,
        coordinate: {
          lat: bean.lat,
          lng: bean.lng
        },
        images: bean.images,
        description: bean.desscription
      })
    }
    const fail = (res: FailResponse) => {
      dangerToast(`${t("delete")} ${t("fail")}`);
      onClose();
    }
    MemorialMapApi.delete({userId: userInfo.id, clanId: userInfo.clanId, targetId: id}, success, fail);
  }

  const onSave = (observer: BeanObserver<any>) => {
    const success = (res: ServerResponse) => {
      if (res.status === "error") fail(null as any);
      successToast(`${t("save")} ${t("success")}`);
      onClose();
    }
    const fail = (res: FailResponse) => {
      dangerToast(`${t("save")} ${t("fail")}`);
      onClose();
    }
    MemorialMapApi.save(observer.getBean(), success, fail);
  }

  React.useEffect(() => {
    if (!loading) {
      const newObserver = new BeanObserver(bean, setBean);
      setContainer(
        <SlidingPanel
          orient={SlidingPanelOrient.BottomToTop} 
          visible={visible} 
          className="bg-white pb-3"
          header={"Di Tích"}      
          close={onClose}
        >
          <Form 
            observer={newObserver} 
            serverBaseUrl={serverBaseUrl} 
            deadMembers={deadMembers}
            onDelete={onDelete}
            onSave={onSave}
          />
        </SlidingPanel>
      )
    } 
  }, [ loading, visible, bean ])

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

interface FormProps {
  serverBaseUrl: string;
  deadMembers: any[];
  observer: BeanObserver<any>;
  onDelete: () => void;
  onSave: (observer: BeanObserver<any>) => void;
}
function Form({ serverBaseUrl, onDelete, onSave, deadMembers, observer }: FormProps) {
  return (
    <div className="flex-v" style={{ height: "70vh" }}>
      <>
        <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>
        <Input 
          size="small" label={<InputLabel text="Tên Di Tích" required/>}
          value={observer.getBean().name} name="name"
          onChange={observer.watch}
        />
        <Selection
          label={t("Người đã khuất")}
          observer={observer} field={"memberId"}
          defaultValue={{ 
            value: observer.getBean().member_id, 
            label: observer.getBean().member_name 
          }}
          options={deadMembers}
        />
        <Input.TextArea
          size="large" label={<InputLabel text="Mô Tả"/>}
          value={observer.getBean().description} name="description"
          onChange={(e) => observer.update("description", e.target.value)}
        />
        <ImageSelector observer={observer} serverBaseUrl={serverBaseUrl}/>
      </>

      <>
        <Text.Title className="text-capitalize text-primary py-2"> {t("utilities")} </Text.Title>
        <div className="flex-h">
          <Button variant="primary" size="small" style={{ width: "fit-content" }} onClick={() => onSave(observer)} prefixIcon={<CommonIcon.Save/>}>
            {t("save")}
          </Button>
          <Button 
            variant="primary" size="small" style={{ width: "fit-content" }} 
            onClick={onDelete} prefixIcon={<CommonIcon.Trash/>}
          >
            {t("delete")}
          </Button>
        </div>
      </>
    </div>
  )
}

interface ImageSelectorProps {
  observer: BeanObserver<Location>;
  serverBaseUrl: string;
}
function ImageSelector({ observer, serverBaseUrl }: ImageSelectorProps) {
  const [ images, setImages ] = React.useState<GalleryImage[]>([]);
  const [ index, setIndex ] = React.useState(-1);

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
  const [ deadMembers, setDeadMembers ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState(true);

  const [ bean, setBean ] = React.useState<any>({});

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error(result.message);
      } else {
        const data = result.data as any;
        setBean(data);
      }
    }
    const fail = (error: any) => setLoading(false);
    MemorialMapApi.get(userInfo.id, userInfo.clanId, id, success, fail)
  }, [ id ]);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "success") {
        const data = result.data as any[];
        const deadMembers = data.map((dead, idx) => {
          return {
            value: dead.id,
            label: `${dead.name}`,
          }
        })
        setDeadMembers(deadMembers);
      }
    }
    const fail = (error: FailResponse) => console.error(error);
    FamilyTreeApi.searchDeadMember({userId: userInfo.id, clanId: userInfo.clanId}, success, fail);
  }, []);

  return {
    bean: bean, setBean: setBean,
    deadMembers: deadMembers,
    loading: loading
  }
}