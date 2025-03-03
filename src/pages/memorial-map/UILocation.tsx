import React from "react";
import { t } from "i18next";
import { Button, Input, Sheet, Text } from "zmp-ui";
import { Gallery } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails, Counter } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { StyleUtils } from "utils";
import { FamilyTreeApi, MemorialMapApi } from "api";
import { useNotification, useAppContext, useBeanObserver } from "hooks";
import { BeanObserver, CommonIcon, Label, Marker, Selection, SelectionOption } from "components";

import { FailResponse, ServerResponse } from "types/server";
import { GalleryImage } from "pages/gallery/UIGalleryImages";

import { MemorialLocation } from "./UIMap";

interface UILocationProps {
  data: MemorialLocation | null;
  visible: boolean;
  onClose: () => void;
  onRemove: (marker: Marker) => void;
}
export function UILocation(props: UILocationProps) {
  const { data, visible, onClose, onRemove } = props;
  if (data === null) return null;

  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();
  const { deadMembers, error, loading, refresh } = useDeadMembers(data.id);

  const observer = useBeanObserver(data as MemorialLocation);

  const onDelete = () => {
    loadingToast(
      <p> {t("đang xử lý...")} </p>,
      (successToastCB, dangerToastCB) => {
        const success = (result: ServerResponse) => {
          if (result.status === "error") {
            fail();
          } else {
            successToastCB(`${t("delete")} ${t("success")}`);
            onRemove({
              id:           observer.getBean().id,
              name:         observer.getBean().name,
              description:  observer.getBean().description,
              coordinate:   observer.getBean().coordinate,
              images:       observer.getBean().images
            });
            onClose();
          }
        }
        const fail = () => {
          dangerToastCB(`${t("delete")} ${t("fail")}`);
          onClose();
        }
        MemorialMapApi.delete({userId: userInfo.id, clanId: userInfo.clanId, targetId: observer.getBean().id}, success, fail);
      }
    )
  }

  const onSave = () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ dữ liệu"));
      return;
    }
    loadingToast(
      <p> {t("đang xử lý...")} </p>,
      (successToastCB, dangerToastCB) => {
        const success = (res: ServerResponse) => {
          if (res.status === "error") {
            fail();
          } else {
            successToastCB(`${t("save")} ${t("success")}`);
            onClose();
          }
        }
        const fail = () => {
          dangerToastCB(`${t("save")} ${t("fail")}`);
          onClose();
        }
        MemorialMapApi.save(observer.getBean(), success, fail);
      }
    )
  }

  return (
    <Sheet
      visible={visible}
      title={t("info")}
      onClose={onClose}
      height={StyleUtils.calComponentRemainingHeight(0)}
    >
      <UIMemorialLocationForm
        deadMembers={deadMembers}
        observer={observer}
        onSave={onSave} onDelete={onDelete}
      />
    </Sheet>
  )
}

interface UIMemorialLocationFormProps {
  deadMembers: any[];
  observer: BeanObserver<MemorialLocation>;
  onDelete: () => void;
  onSave: () => void;
}
function UIMemorialLocationForm(props: UIMemorialLocationFormProps) {
  const { onDelete, onSave, deadMembers, observer } = props;

  return (
    <div className="scroll-v p-3">
      <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>

      <Input 
        label={<Label text="Tên Di Tích" required/>}
        value={observer.getBean().name} name="name"
        onChange={observer.watch}
      />

      <Selection
        label={t("Người đã khuất")}
        observer={observer} field={"memberId"}
        defaultValue={{ 
          value: observer.getBean().memberId || 0, 
          label: observer.getBean().memberName || ""  
        }}
        options={deadMembers}
      />

      <Input.TextArea
        size="large" label={<Label text="Mô Tả"/>}
        value={observer.getBean().description} name="description"
        onChange={(e) => observer.update("description", e.target.value)}
      />

      <ImageSelector observer={observer}/>

      <div className="flex-v">
        <Text.Title className="text-capitalize text-primary py-2"> {t("hành động")} </Text.Title>
        <div className="scroll-h">
          <Button 
            variant="primary" size="small" 
            onClick={onSave} prefixIcon={<CommonIcon.Save/>}
          >
            {t("save")}
          </Button>
          <Button 
            variant="primary" size="small" 
            onClick={onDelete} prefixIcon={<CommonIcon.Trash/>}
          >
            {t("delete")}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ImageSelectorProps {
  observer: BeanObserver<MemorialLocation>;
}
function ImageSelector(props: ImageSelectorProps) {
  const { observer } = props;
  const { serverBaseUrl } = useAppContext();

  const [ index, setIndex ] = React.useState(-1);

  const remapImgs = (images: string[] | any) => {
    if (!images) return [];
    return images.map((imgPath: string) => ({
      src: `${serverBaseUrl}/${imgPath}`,
      width: 100,
      height: 100,
      imageFit: "contain",
    })) as GalleryImage[];
  }

  const imgs = React.useMemo(() => {
    return remapImgs(observer.getBean().images);
  }, [ observer.getBean().images ]);

  const renderImages = () => {
    if (!imgs.length) return;
    return (
      <>
        <Gallery 
          images={imgs} 
          onClick={(index) => setIndex(index)} 
          enableImageSelection={false} 
          rowHeight={100}
        />
        <Lightbox
          slides={imgs}
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
      <label> {t("Ảnh")} </label>
      {renderImages()}
    </div>
  )
}

function useDeadMembers(id: number) {
  const { userInfo } = useAppContext();

  const [ deadMembers, setDeadMembers ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setDeadMembers([]);

    const success = (result: ServerResponse) => {
      setLoading(false)
      if (result.status === "success") {
        const data = result.data as any[];
        const deadMembers = data.map((dead, idx) => {
          return {
            value: dead.id,
            label: `${dead.name}`,
          } as SelectionOption
        })
        setDeadMembers(deadMembers);
      } else {
        setLoading(false)
        setError(true);
      }
    }
    const fail = (error: FailResponse) => {
      setLoading(false)
      setError(true);
    };
    FamilyTreeApi.searchDeadMember({userId: userInfo.id, clanId: userInfo.clanId}, success, fail);
  }, [ reload ]);

  return { deadMembers, loading, error, refresh }
}