import React from "react";
import { t } from "i18next";
import { Button, Input, Modal, Sheet, Text } from "zmp-ui";
import { Gallery } from "react-grid-gallery";
import { Lightbox } from "yet-another-react-lightbox";
import { Zoom, Thumbnails, Counter } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { StyleUtils } from "utils";
import { FamilyTreeApi, MemorialMapApi } from "api";
import { useNotification, useAppContext, useBeanObserver } from "hooks";
import { BeanObserver, CommonIcon, Label, Selection, SelectionOption } from "components";

import { ServerResponse } from "types/server";
import { GalleryImage } from "pages/gallery/UIGalleryImages";

import { MemorialLocation } from "./UIMap";

interface UILocationProps {
  data: MemorialLocation | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UILocation(props: UILocationProps) {
  const { data, visible, onClose, onReloadParent } = props;
  if (data === null) return null;

  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const observer = useBeanObserver({
    id:           data.id,
    name:         data.name,
    description:  data.description,
    coordinate:   data.coordinate,
    clanId:       data.clanId,
    images:       data.images,
    memberId:     data.memberId,
    memberName:   data.memberName,
  } as MemorialLocation);

  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const onDelete = () => {
    loadingToast(
      <p> {t("đang xử lý...")} </p>,
      (successToastCB, dangerToastCB) => {
        const success = (result: ServerResponse) => {
          if (result.status === "error") {
            fail();
          } else {
            successToastCB(`${t("delete")} ${t("success")}`);
            onClose();
            if (onReloadParent) onReloadParent();
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
        MemorialMapApi.save({
          record: observer.getBean(), 
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("save")} ${t("fail")}`);
            } else {
              successToastCB(`${t("save")} ${t("success")}`);
              onClose();
              if (onReloadParent) onReloadParent();
            }
          }, 
          fail: () => dangerToastCB(`${t("save")} ${t("fail")}`)
        });
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
        observer={observer}
        onSave={onSave} onDelete={() => setDeleteWarning(true)}
      />
      <Modal
        visible={deleteWarning}
        mask maskClosable
        title={t("Hành động không thể thu hồi")}
        description={t("Bạn có chắc muốn xoá di tích này?")}
        onClose={() => setDeleteWarning(false)}
        actions={[
          { text: t("Xoá"), onClick: onDelete },
          { text: t("Đóng"), close: true },
        ]}
      />
    </Sheet>
  )
}

interface UIMemorialLocationFormProps {
  observer: BeanObserver<MemorialLocation>;
  onDelete: () => void;
  onSave: () => void;
}
function UIMemorialLocationForm(props: UIMemorialLocationFormProps) {
  const { onDelete, onSave, observer } = props;
  const { members, error, loading, refresh } = useDeadMembers();

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
        options={members}
        onChange={(value: SelectionOption) => {
          observer.update("memberId", value.value);
          observer.update("memberName", value.label);
        }}
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

function useDeadMembers() {
  const { userInfo } = useAppContext();

  const [ members, setDeadMembers ] = React.useState<SelectionOption[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setDeadMembers([]);

    FamilyTreeApi.searchDeadMember({
      userId: userInfo.id, 
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
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
      }, 
      fail: () => {
        setLoading(false)
        setError(true);
      }
    });
  }, [ reload ]);

  return { members, loading, error, refresh }
}