import React from "react";
import { t } from "i18next";
import { Input, Sheet } from "zmp-ui";

import { Info, Loading } from "components";
import { HallOfFameApi } from "api";
import { useAppContext } from "hooks";

import { FailResponse, ServerResponse } from "types/server";
import { StyleUtils } from "utils";

export interface HallOfFameUser {
  id: number;
  name: string;
  member: string;
  ranking: number;
  recognitionDate?: string;
}

interface UIHallOfFameUserProps {
  userId: number | null;
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void;
}
export function UIHallOfFameUserDetails(props: UIHallOfFameUserProps) {
  const { visible, onClose, userId } = props;
  const { data, error, loading, refresh } = useHallOfFameUser(userId);

  const onSave = () => {

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
        <div className="flex-v p-3">
          <Input label={t("Họ Tên")} value={data.member} name="member"/>
          <Input label={t("Xếp Hạng")} value={data.ranking} name="ranking"/>
          <Input label={t("Ngày Chứng Nhận")} value={data.recognitionDate} name="recognitionDate"/>
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
      return data.name;
    }
  }

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={title()}
      height={StyleUtils.calComponentRemainingHeight(0)}
    >
      {renderContainer()}
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
              id:               data.id,
              name:             data.name,
              member:           data.member_name,
              ranking:          data.ranking,
              recognitionDate:  data.recognition_date
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