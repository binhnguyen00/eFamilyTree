import React from "react";
import { t } from "i18next";
import { Button, DatePicker, Input, Sheet, Text } from "zmp-ui";

import { CommonIcon, Info, Loading } from "components";
import { HallOfFameApi } from "api";
import { useAppContext, useBeanObserver, useNotification } from "hooks";

import { FailResponse, ServerResponse } from "types/server";
import { DateTimeUtils, StyleUtils } from "utils";

export interface HallOfFameUser {
  id: number;
  name: string;
  avatar: string;
  memberId: number;
  memberName: string;
  typeId: number;
  typeName: string;
  ranking?: number;
  recognitionDate?: string;
  achievement?: string;
}

interface UIHallOfFameUserProps {
  userId: number | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UIHallOfFameUserDetails(props: UIHallOfFameUserProps) {
  const { visible, onClose, userId, onReloadParent } = props;
  const { userInfo, serverBaseUrl } = useAppContext();
  const { loadingToast } = useNotification();
  const { data, error, loading, refresh } = useHallOfFameUser(userId);

  const observer = useBeanObserver(data as HallOfFameUser);

  const onSave = () => {
    loadingToast(
      <div className="flex-v">
        <p> {t("đang lưu...")} </p>
        <p> {t("vui lòng chờ")} </p>
      </div>,
      (successToast, dangerToast) => {
        HallOfFameApi.saveUserToHallOfFame({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          form: observer.getBean(),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToast(t("lưu thất bại"))
            } else {
              successToast(t("lưu thành công"))
              if (onReloadParent) onReloadParent();
              onClose();
            }
          }, 
          fail: () => {
            dangerToast(t("lưu thất bại"))
          }
        })
      }
    )
  }

  const onDelete = () => {
    loadingToast(
      <div className="flex-v">
        <p> {t("đang xoá...")} </p>
        <p> {t("vui lòng chờ")} </p>
      </div>,
      (successToast, dangerToast) => {
        HallOfFameApi.removeUserFromHallOfFame({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          memberId: observer.getBean().memberId,
          typeId: observer.getBean().typeId,
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToast(t("xoá thất bại"))
            } else {
              successToast(t("xoá thành công"))
              if (onReloadParent) onReloadParent();
              onClose();
            }
          }, 
          fail: () => {
            dangerToast(t("xoá thất bại"))
          }
        })
      }
    )
  }

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Info title={t("chưa có dữ liệu")} message={t("hãy thử lại")}/>
    } else if (data === null) {
      return <Info title={t("chưa có dữ liệu")} message={t("hãy thử lại")}/>
    } else {
      return (
        <div className="flex-v p-3 scroll-v">
          <div className="flex-v center">
            <img
              className="circle"
              style={{ width: "8rem", height: "8rem", objectFit: "cover" }}
              src={`${serverBaseUrl}/${observer.getBean().avatar}`}
              onError={(e) => e.currentTarget.src = "https://avatar.iran.liara.run/public/47"}
            />
            <Text.Title> {observer.getBean().name} </Text.Title>
          </div>
          <DatePicker
            value={
              observer.getBean().recognitionDate 
                ? DateTimeUtils.toDate(observer.getBean().recognitionDate!) 
                : undefined
            }
            onChange={(date: Date, pickedValue: any) => {
              const value: string = DateTimeUtils.formatToDate(date);
              observer.update("recognitionDate", value)
            }}
          />
          <Input.TextArea 
            label={t("thành tích đạt được")} 
            value={observer.getBean().achievement} name="achievement"
            onChange={(e) => observer.update("achievement", e.target.value)}
          />
        </div>
      )
    }
  }

  const title = () => {
    if (loading) {
      return t("loading")
    } else if (error) {
      return t("error")
    } else if (data === null) {
      return t("chưa có dữ liệu")
    } else {
      return data.typeName;
    }
  }

  const renderFooter = () => {
    return (
      <div className="flex-v">
        <Text.Title> {t("Hành Động")} </Text.Title>
        <div className="flex-h flex-grow-0 justify-start">
          <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave}>
            {t("save")}
          </Button>
          <Button size="small" prefixIcon={<CommonIcon.Trash/>} onClick={onDelete}>
            {t("delete")}
          </Button>
        </div>
      </div>
    )
  } 

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={title()}
      height={StyleUtils.calComponentRemainingHeight(0)}
    >
      {renderContainer()}

      {renderFooter()}
    </Sheet>
  )
}

function useHallOfFameUser(userId: number | null) {
  const { userInfo } = useAppContext();

  const [ data, setData ] = React.useState<HallOfFameUser | null>(null);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setData(null)
    if (userId !== null) {
      HallOfFameApi.getHallOfFameUserInfo({
        userId: userInfo.id,
        clanId: userInfo.clanId,
        id: userId,
        success: (result: ServerResponse) => {
          setLoading(false);
          if (result.status === "error") {
            console.error(result.message);
            setError(true);
          } else {
            const data = result.data as any;
            setData({
              id:               data["id"],
              name:             data["name"],
              avatar:           data["avatar"],
              memberId:         data["member_id"],
              memberName:       data["member_name"],
              typeId:           data["type_id"],
              typeName:         data["type_name"],
              ranking:          data["ranking"],
              recognitionDate:  data["recognition_date"]
            });
          }
        },
        fail: (error: FailResponse) => {
          setLoading(false);
          setError(true);
          console.error(error.stackTrace);
        }
      })
    }
  }, [ reload, userId ])

  return { data, error, loading, refresh };
}