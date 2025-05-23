import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Button, Input, Text, Sheet, Modal, DatePicker, Avatar } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { CommonIcon, Selection, Label, SelectionOption, ScrollableDiv } from "components";
import { CommonUtils, DateTimeUtils, TreeDataProcessor, ZmpSDK } from "utils";
import { TreeMember, PageContextProps, FailResponse, ServerResponse } from "types";
import { useBeanObserver, useNotification, useAppContext, useRouteNavigate } from "hooks";

interface UITreeMemberProps extends PageContextProps {
  info: TreeMember | null;
  visible: boolean;
  processor: TreeDataProcessor;
  onClose: () => void;
  toSubNodes?: (nodeId: string) => void;
  onCreateSpouse?: () => void;
  onCreateChild?: () => void;
  onCreateSibling?: () => void;
  onReloadParent?: () => void;
}
export function UITreeMember(props: UITreeMemberProps) {
  const { info, visible, processor, permissions, onCreateSpouse, onCreateChild, onCreateSibling, onReloadParent, onClose, toSubNodes } = props;
  const { canWrite } = permissions;

  if (info === null) return;

  const observer = useBeanObserver(info || {} as TreeMember);
  const { goTo } = useRouteNavigate();
  const { userInfo, serverBaseUrl } = useAppContext();
  const { successToast, dangerToast, warningToast, loadingToast } = useNotification();
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);

  const moms = processor.getSpouses(info.fatherId || 0);
  const momOpts = moms.map((mom) => {
    return {
      value: parseInt(mom.id), 
      label: mom.name
    }
  }) as SelectionOption[];

  const isOwner = (): boolean => observer.getBean().id === userInfo.id;
  const isFemale = (): boolean => observer.getBean().gender === "0";
  const isMale = (): boolean => observer.getBean().gender === "1";
  const hasParents = (): boolean => {
    const fatherName = observer.getBean().father;
    const motherName = observer.getBean().mother;
    if (fatherName || motherName) return true;
    return false;
  };
  const hasChildren = (): boolean => observer.getBean().children.length > 0;
  const hasAvatar = (): boolean => !!observer.getBean().avatar;
  const isRoot = (): boolean => {
    const isGenOne = (): boolean => observer.getBean().generation === 1;
    if (isMale() && !hasParents() && isGenOne()) 
      return true;
    else if (isFemale() && isGenOne())
      return false;
    return false;
  }

  const onSave = () => {
    if (!observer.getBean().name) {
      dangerToast(t("nhập đủ thông tin"))
      return;
    }
    loadingToast({
      content: <p> {t("đang lưu...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.saveMember({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          member: observer.getBean(),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("save")} ${t("fail")}`)
            } else {
              successToastCB(`${t("save")} ${t("success")}`)
              const bean = result.data;
              observer.update("name", bean.name);
              observer.update("phone", bean.phone);
              observer.update("gender", bean.gender);
              observer.update("birthday", bean.birthday);
              observer.update("lunarDeathDay", bean.lunar_death_day)
              observer.update("deathDateNote", bean.death_date_note)
              if (onReloadParent) onReloadParent();
            }
            onClose();
          },
          fail: (error: FailResponse) => dangerToastCB(`${t("save")} ${t("fail")}`)
        })
      }
    })
  }

  const onArchive = () => {
    if (isRoot()) { dangerToast(t("Không thể xoá Thành viên Thuỷ Tổ")); return; }
    if (hasChildren()) { dangerToast(t("Thành viên có con, không thể xoá")); return; }
    loadingToast({
      content: <p> {t("đang xoá...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        FamilyTreeApi.archiveMember({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: observer.getBean().id,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(`${t("delete")} ${t("fail")}`)
            } else {
              successToastCB(`${t("delete")} ${t("success")}`)
            }
            setDeleteWarning(false);
            onClose();
            if (onReloadParent) onReloadParent();
          },
          fail: (error: FailResponse) => {
            dangerToastCB(`${t("delete")} ${t("fail")}`)
            setDeleteWarning(false);
          }
        })
      }
    })
  }

  const renderAvatar = () => {

    const onUpdateAvatar = () => {
      const doUpdate = (base64: string) => {
        loadingToast({
          content: t("Cập nhật Ảnh đại diện..."),
          operation: (successToastCB, dangerToastCB) => {
            FamilyTreeApi.updateAvatar({
              userId: userInfo.id,
              clanId: userInfo.clanId,
              memberId: observer.getBean().id,
              base64: base64,
              success: (result: ServerResponse) => {
                if (result.status === "error") {
                  dangerToastCB(t("cập nhật không thành công"))
                } else {
                  successToastCB(t("cập nhật thành công"))
                  const publicPath = result.data as string;
                  observer.update("avatar", publicPath);
                }
              },
              fail: () => dangerToastCB(t("cập nhật không thành công"))
            })
          }
        })
      }
  
      if (!isOwner()) {
        warningToast(t("không thể cập nhật ảnh đại diện của thành viên khác"));
        return;
      }
      ZmpSDK.chooseImage({
        howMany: 1,
        success: async (files: any[]) => {
          const blobs: string[] = [ ...files.map(file => file.path) ];
          const base64s = await CommonUtils.blobUrlsToBase64s(blobs);
          if (base64s.length) doUpdate(base64s[0]);
          else {
            dangerToast(t("ảnh bị lỗi"))
            return;
          }
        },
        fail: () => dangerToast(t("cập nhật không thành công"))
      });
    }

    const src: string = hasAvatar()
    ? `${serverBaseUrl}/${observer.getBean().avatar}`
    : isMale()
      ? "https://avatar.iran.liara.run/public/47"  // male avatar placeholder
      : "https://avatar.iran.liara.run/public/98"; // female avatar placeholder

    return (
      <div className="flex-v center"> 
        <PhotoProvider maskClosable maskOpacity={0.5} pullClosable bannerVisible={false}>
          <PhotoView src={src}>
            <Avatar src={src} size={140} className="object-cover"/>
          </PhotoView>
        </PhotoProvider>
        <div className="flex-h">
          <Button size="small" variant="tertiary" prefixIcon={<CommonIcon.Bookmark/>} onClick={goToBiography} className="button-link">
            {t("tiểu sử")}
          </Button>
          <Button size="small" variant="tertiary" prefixIcon={<CommonIcon.AddPhoto/>} onClick={onUpdateAvatar} className={classNames("button-link", !isOwner() && "hide")}>
            {t("sửa ảnh")}
          </Button>
          <Button 
            size="small" variant="tertiary" className="button-link"
            prefixIcon={<CommonIcon.Tree size={"1rem"}/>} style={{ minWidth: 140 }} 
            onClick={() => toSubNodes?.(observer.getBean().id.toString())}
          >
            {t("nhánh")}
          </Button>
        </div>
      </div>
    )
  }

  const goToBiography = () => {
    goTo({ 
      path: "family-tree/biography", 
      belongings: { 
        id : observer.getBean().id,
        permissions : permissions,
      }
    })
  }

  return (
    <Sheet
      height={"80vh"}
      visible={visible} onClose={onClose} swipeToClose
    >
      <ScrollableDiv direction="vertical" className="flex-v p-3">
        {/* form */}
        <div className="flex-v flex-grow-0">
          {/* avatar */}
          {renderAvatar()}
          {/* information */}
          <Input 
            name="name" label={<Label text={t("họ tên")}/>}
            value={observer.getBean().name} onChange={observer.watch} disabled={!canWrite}
          />
          <div className="flex-h">
            <Input 
              name="code" label={<Label text={t("mã")}/>}
              value={observer.getBean().code} disabled
              suffix={<CommonIcon.Copy size={24} 
                onClick={() => CommonUtils.copyToClipboard({
                  value: observer.getBean().code,
                  successToast,
                  warningToast
                })}
              />}
            />
            <Input 
              name="phone" type="number" label={<Label text={t("điện thoại")}/>}
              value={observer.getBean().phone} onChange={observer.watch} disabled={!canWrite}
              suffix={<CommonIcon.Copy size={24} onClick={() => CommonUtils.copyToClipboard({
                value: observer.getBean().phone,
                successToast,
                warningToast
              })}/>}
            />
          </div>
          <Selection
            defaultValue={
              observer.getBean().gender === "1" 
                ? { value: "1", label: t("male") }
                : { value: "0", label: t("female") }
            }
            options={[
              { value: "1", label: t("male") },
              { value: "0", label: t("female") }
            ]}
            observer={observer} field="gender" label={t("giới tính")} isDisabled={!canWrite}
          />
          <div className="flex-h">
            <DatePicker 
              mask maskClosable disabled={!canWrite}
              label={t("Ngày Sinh")} title={t("Ngày Sinh")}
              onChange={(date: Date, calendarDate: any) => {
                observer.update("birthday", DateTimeUtils.formatToDate(date));
              }}
              value={
                observer.getBean().birthday 
                ? DateTimeUtils.toDate(observer.getBean().birthday)
                : undefined
              }
            />
            <DatePicker 
              mask maskClosable disabled={!canWrite}
              label={t("Ngày Mất (Âm lịch)")} title={t("Ngày Mất (Âm lịch)")}
              onChange={(date: Date, calendarDate: any) => {
                observer.update("lunarDeathDay", DateTimeUtils.formatToDate(date));
              }}
              value={
                observer.getBean().lunarDeathDay 
                ? DateTimeUtils.toDate(observer.getBean().lunarDeathDay)
                : undefined
              }
            />
          </div>
          <Input.TextArea
            label={<Label text={t("Ngày Mất (Âm lịch)")}/>} disabled={!canWrite}
            value={observer.getBean().deathDateNote} name="deathDateNote"
            onChange={(e) => observer.update("deathDateNote", e.target.value)} size="small"
          />
          <Input 
            label={<Label text={t("bố")}/>}
            value={observer.getBean().father} name="father" disabled
          />
          <Selection
            options={momOpts} 
            observer={observer} field="" label={t("mẹ")} isDisabled={!canWrite}
            defaultValue={{ value: observer.getBean().motherId, label: observer.getBean().mother }}
            onChange={(selected: SelectionOption, action) => {
              observer.update("mother", selected.label)
              observer.update("motherId", selected.value)
            }}
          />
        </div>

        {/* footer */}
        <div className="flex-v flex-grow-0">

          <div className="scroll-h">
            <Button size="small" prefixIcon={<CommonIcon.Save size={"1rem"}/>} style={{ minWidth: 120 }} onClick={onSave} className={classNames(!canWrite && "hide")}>
              {t("save")}
            </Button>

            {!isRoot() && (
              <Button size="small" prefixIcon={<CommonIcon.Trash size={"1rem"}/>} style={{ minWidth: 120 }} onClick={() => setDeleteWarning(true)} className={classNames(!canWrite && "hide")}>
                {t("delete")}
              </Button>
            )}
          </div>

          <div className={classNames("flex-v", !canWrite && "hide")}>
            <Text.Title> {t("Thêm Thành Viên")} </Text.Title>
            <div className="scroll-h">
              {!isFemale() && (
                <Button size="small" prefixIcon={<CommonIcon.AddPerson size={"1rem"}/>} style={{ minWidth: 120 }} onClick={onCreateChild}>
                  {t("Con")}
                </Button>
              )}
              {(isRoot() || hasParents()) && (
                <Button size="small" prefixIcon={<CommonIcon.MaleFemale size={"1rem"}/>} style={{ minWidth: 120 }} onClick={onCreateSpouse}>
                  {isMale() ? t("Vợ") : t("Chồng")}
                </Button>
              )}
              {hasParents() && (
                <Button size="small" prefixIcon={<CommonIcon.AddPerson size={"1rem"}/>} style={{ minWidth: 140 }} onClick={onCreateSibling}>
                  {t("Anh/Chị/Em")}
                </Button>
              )}
            </div>
          </div>

        </div>

      </ScrollableDiv>

      <Modal
        visible={deleteWarning}
        title={t("Hành động không thể hoàn tác")}
        description={t("Bạn có chắc muốn xoá thành viên này?")}
        mask maskClosable
        onClose={() => setDeleteWarning(false)}
        actions={[
          { text: t("delete"), onClick: onArchive, danger: true },
          { text: t("Đóng"), close: true },
        ]}
      />

    </Sheet>
  )
}