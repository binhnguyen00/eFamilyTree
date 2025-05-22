import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { DivUtils } from "utils";
import { PagePermissions, ServerResponse } from "types";
import { CommonIcon, Header, Loading, Retry, RichTextEditor } from "components";
import { useBeanObserver, useRouteNavigate, useAppContext, useNotification } from "hooks";

function useBiography(userId: number) {
  const { userInfo } = useAppContext();
  
  const [ biography, setBiography ] = React.useState<string>("");
  const [ loading, setLoading ]     = React.useState(false);
  const [ error, setError ]         = React.useState(false);
  const [ reload, setReload ]       = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);

    FamilyTreeApi.getBiography({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      memberId: userId,
      success: (response: ServerResponse) => {
        setLoading(false);
        if (response.status === "success") {
          const data = response.data as string;
          setBiography(data);
        } else {
          setError(true);
        }
      },
      fail: () => {
        setLoading(false);
        setError(true);
      }
    })
  }, [ reload ])

  return { biography, loading, error, refresh }
}

export function UIBiography() {
  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();
  const { belongings } = useRouteNavigate();
  const { userId, userName, permissions } = belongings as {
    userId: number;
    userName: string;
    permissions: PagePermissions;
  };
  const { biography, loading, error, refresh } = useBiography(userId)
  const observer = useBeanObserver({
    userId: userId,
    userName: userName,
    biography: biography,
  } as {
    userId: number;
    userName: string;
    biography: string;
  })

  const onSave = () => {
    loadingToast({
      content: <p> {t("đang lưu...")} </p>,
      operation: (successToastCB, dangerToastCB, dismiss) => {
        FamilyTreeApi.updateBiography({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          memberId: observer.getBean().userId,
          biography: observer.getBean().biography,
          success: () => {
            successToastCB(t("lưu thành công"));
            refresh();
          },
          fail: () => {
            dangerToastCB(t("lưu không thành công"));
          }
        })
      }
    })
  }

  const renderContainer = () => {
    const hasBiography = !!observer.getBean().biography;

    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Retry title={t("Gặp sự cố")} onClick={refresh}/>
    } else {
      return (
        <div className="flex-v">
          <RichTextEditor 
            className="mt-2" field="biography" observer={observer} placeholder={hasBiography ? `${t("Tiểu sử")} của ${name}` : t("Bắt đầu viết tiểu sử...")}
            height={DivUtils.calculateHeight(60)} disabled={!permissions.canModerate}
          />
          <div className="p-2" style={{ position: "absolute", right: 0, bottom: 0 }}>
            <Button size="small" variant="primary" prefixIcon={<CommonIcon.Save/>} onClick={onSave} className={classNames(!permissions.canModerate && "hide")}>
              {t("save")}
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <Header title={t("Tiểu sử")}/>

      <div className="container bg-white text-base min-h-[100vh]">
        {renderContainer()}
      </div>
    </>
  )
}