import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { ToastContent } from "react-toastify";
import { PhotoProvider, PhotoView } from "react-photo-view"
import { Button, Grid, Input, Modal, Sheet, Text } from "zmp-ui";

import { MemorialMapApi } from "api";
import { ServerResponse, Photo, PageContextProps } from "types";
import { CommonUtils, DivUtils, ZmpSDK } from "utils";
import { useNotification, useAppContext, useBeanObserver, useFamilyTree } from "hooks";
import { BeanObserver, CommonIcon, Label, Selection, SelectionOption, SizedBox } from "components";

import { MemorialLocation } from "./UIMap";

interface UILocationProps extends PageContextProps {
  data: MemorialLocation | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UILocation(props: UILocationProps) {
  const { data, visible, onClose, onReloadParent, permissions } = props;
  if (data === null) return null;

  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();

  const observer = useBeanObserver({
    id:           data.id,
    name:         data.name,
    description:  data.description,
    coordinate:   data.coordinate,
    clanId:       data.clanId,
    photoUrl:     data.photoUrl,
    photos:       data.photos,
    memberId:     data.memberId,
    memberName:   data.memberName,
  } as MemorialLocation);

  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const onDelete = () => {
    loadingToast({
      content: <p> {t("đang xử lý...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
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
        MemorialMapApi.delete({
          userId: userInfo.id, 
          clanId: userInfo.clanId, 
          targetId: observer.getBean().id}, 
          success, fail
        );
      }
    })
  }

  const onSave = () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ dữ liệu"));
      return;
    }
    loadingToast({
      content: <p> {t("đang xử lý...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        MemorialMapApi.save({
          record: observer.getBean(), 
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("save")} ${t("fail")}`);
            } else {
              successToastCB(`${t("save")} ${t("success")}`);
              if (onReloadParent) onReloadParent();
            }
          }, 
          fail: () => dangerToastCB(`${t("save")} ${t("fail")}`)
        });
      }
    })
  }

  return (
    <Sheet
    title={t("info")}
      visible={visible}
      onClose={onClose}
      height={DivUtils.calculateHeight(0)}
    >
      <UIMemorialLocationForm
        observer={observer} permissions={permissions}
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

interface UIMemorialLocationFormProps extends PageContextProps {
  observer: BeanObserver<MemorialLocation>;
  onDelete: () => void;
  onSave: () => void;
}
function UIMemorialLocationForm(props: UIMemorialLocationFormProps) {
  const { onDelete, onSave, observer, permissions } = props;
  const { useDeadMembers } = useFamilyTree();
  const { members } = useDeadMembers();

  return (
    <div className="scroll-v p-3">
      <Text.Title className="text-capitalize text-primary py-2"> {t("info")} </Text.Title>

      <Input 
        label={<Label text="Tên Di Tích" required/>}
        value={observer.getBean().name} name="name"
        onChange={observer.watch} disabled={!permissions.canWrite}
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
        isDisabled={!permissions.canWrite}
      />

      <Input.TextArea
        size="large" label={<Label text="Mô Tả"/>}
        value={observer.getBean().description} name="description"
        onChange={(e) => observer.update("description", e.target.value)}
        disabled={!permissions.canWrite}
      />

      <div className="scroll-h">
        <Button 
          variant="primary" size="small" className={classNames(!permissions.canWrite && "hide")}
          onClick={onSave} prefixIcon={<CommonIcon.Save/>}
        >
          {t("save")}
        </Button>
        <Button 
          variant="primary" size="small" className={classNames(!permissions.canWrite && "hide")}
          onClick={onDelete} prefixIcon={<CommonIcon.Trash/>}
        >
          {t("delete")}
        </Button>
      </div>

      <UIPhotoSelector observer={observer} permissions={permissions}/>
    </div>
  )
}

interface ImageSelectorProps extends PageContextProps {
  observer: BeanObserver<MemorialLocation>;
}
export function UIPhotoSelector(props: ImageSelectorProps) {
  const { observer, permissions } = props;
  const { userInfo, serverBaseUrl } = useAppContext();
  const { warningToast, dangerToast, successToast } = useNotification();
  const { photoWidth, photoHeight } = { photoWidth: 100, photoHeight: 100 }

  const [ isSelecting, setIsSelecting ] = React.useState<boolean>(false);
  const [ selectedPhotos, setSelectedPhotos ] = React.useState<Photo[]>([]);
  const [ photos, setPhotos ] = React.useState<Photo[]>(observer.getBean().photos || []);

  const withEase: string = "transition-all duration-300 ease-in-out";

  const onSavePhotos = (base64s: string[], successCB: (message: ToastContent) => void, dangerCB: (message: ToastContent) => void) => { 
    MemorialMapApi.updatePhotos({
      userId  : userInfo.id,
      clanId  : userInfo.clanId,
      id      : observer.getBean().id,
      photos  : base64s,
      success: (response: ServerResponse) => {
        if (response.status === "success") {
          const raws: any[] = response.data;
          const newPhotos: Photo[] = CommonUtils.convertToPhoto(raws, "location_id");
          setPhotos(newPhotos);
          successCB(t("lưu thành công"));
        } else {
          dangerCB(t("lưu thất bại"));
        }
      },
      fail: () => {
        dangerCB(t("lưu thất bại"));
      }
    })
  }

  const onRemovePhotos = async (): Promise<void> => {
    if (selectedPhotos.length === 0) {
      warningToast(t("chọn ít nhất 1 ảnh"));
      return;
    }
    try {
      const remainingPhotos: Photo[] = photos.filter(
        (photo) => !selectedPhotos.some((p) => p.id === photo.id)
      );
      setPhotos(remainingPhotos);
      MemorialMapApi.removePhotos({
        userId  : userInfo.id,
        clanId  : userInfo.clanId,
        id      : observer.getBean().id,
        photoIds: selectedPhotos.map(photo => photo.id),
        success: () => {
          successToast(t("xóa ảnh thành công"));
        },
        fail: () => {
          dangerToast(t("xóa ảnh thất bại, vui lòng thử lại"));
        }
      })
      setSelectedPhotos([]);
      setIsSelecting(false);
    } catch (error) {
      dangerToast(t("xóa ảnh thất bại, vui lòng thử lại"));
    }
  };

  const onAddPhotos = () => {
    ZmpSDK.chooseImage({
      howMany: 5, 
      success: async (files: any[]) => {
        if (photos.length + files.length > 5) {
          dangerToast(t("chọn tối đa 5 ảnh"));
          return;
        }
        const urls: string[] = [ 
          ...photos.map(photo => photo.url), 
          ...files.map(file => file.path) 
        ];
        const base64s = await CommonUtils.blobUrlsToBase64s(urls);
        onSavePhotos(base64s, successToast, dangerToast);
      },
      fail: () => dangerToast(t("chọn tối đa 5 ảnh"))
    });
  }

  const onSelectionMode = (): void => {
    setIsSelecting(!isSelecting);
    if (!isSelecting) {
      setSelectedPhotos([]);
    }
  };

  const onSelectPhoto = (photo: Photo): void => {
    if (!isSelecting) return;
    setSelectedPhotos((prev) => {
      if (prev.some((p) => p.id === photo.id)) {
        return prev.filter((p) => p.id !== photo.id);
      } else {
        return [...prev, photo];
      }
    });
  };

  const renderPhotos = (): React.ReactNode => {
    return photos.map((photo: Photo) => {
      const isSelected: boolean = selectedPhotos.some((p) => p.id === photo.id);
      return (
        <div key={photo.id} className="relative" onClick={() => onSelectPhoto(photo)}>
          {isSelecting ? (
            <>
              <img
                src={`${serverBaseUrl}/${photo.url}`}
                className="object-cover transition-opacity duration-300 ease-in-out hover:opacity-90"
                style={{ width: photoWidth, height: photoHeight }}
              />
              <div
                className={`absolute bottom-2 left-2 w-7 h-7 rounded-full ${
                  isSelected ? 'bg-primary' : 'bg-white/50'
                }`}
              >
                {isSelected && <CommonIcon.CheckCircle className="text-white w-7 h-7" />}
              </div>
            </>
          ) : (
            <PhotoView src={`${serverBaseUrl}/${photo.url}`} key={photo.id}>
              <img
                src={`${serverBaseUrl}/${photo.url}`}
                className="object-cover transition-opacity duration-300 ease-in-out hover:opacity-90"
                style={{ width: photoWidth, height: photoHeight }}
              />
            </PhotoView>
          )}
        </div>
      );
    });
  };


  return (
    <div className="flex-v flex-grow-0">
      <div className="flex-h flex-grow-0 justify-between">
        <Text size={"small"} className="bold flex-h content-center align-start" style={{ minWidth: 120 }}>{`${t("Ảnh")} (${photos.length})`}</Text>
        <div className="flex-h">
          <Button 
            size="small" className={classNames(withEase, !permissions.canWrite && "hide")} variant="tertiary" 
            prefixIcon={isSelecting && <CommonIcon.Check />} onClick={onSelectionMode}
          >
            {isSelecting ? t("xong") : t("select")}
          </Button>
          {isSelecting && selectedPhotos.length > 0 && (
            <Button 
              size="small" className={classNames(withEase, !permissions.canWrite && "hide")} variant="tertiary" 
              prefixIcon={<CommonIcon.RemovePhoto />} onClick={onRemovePhotos}
            >
              {t("delete")}
            </Button>
          )}
        </div>
      </div>
      <PhotoProvider maskOpacity={0.5} maskClosable pullClosable>
        <Grid columnCount={3} rowSpace="1rem" columnSpace="1rem">
          {renderPhotos()}
          {photos.length < 5 && (
            <SizedBox
              className={classNames("button", "flex-h", "text-underline", withEase, !permissions.canWrite && "hide")}
              width={photoWidth} height={photoHeight} onClick={onAddPhotos}
            >
              <CommonIcon.AddPhoto /> {t("add")}
            </SizedBox>
          )}
        </Grid>
      </PhotoProvider>
    </div>
  )
}