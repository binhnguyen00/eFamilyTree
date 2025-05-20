import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { PageContextProps, PagePermissions, ServerResponse } from "types";
import { Header, Loading, Retry, RichTextEditor, ScrollableDiv } from "components";
import { useBeanObserver, useRouteNavigate, useAppContext, useNotification } from "hooks";
import classNames from "classnames";

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
  const { id, permissions } = belongings as {
    id: number;
    permissions: PagePermissions;
  };
  const { biography, loading, error, refresh } = useBiography(id)
  const observer = useBeanObserver({
    id: id,
    biography: biography,
  } as {
    id: number;
    biography: string;
  })

  const onSave = () => {
    loadingToast({
      content: <p> {t("đang lưu...")} </p>,
      operation: (successToastCB, dangerToastCB, dismiss) => {
        FamilyTreeApi.updateBiography({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          memberId: id,
          biography: observer.getBean().biography,
          success: () => {
            successToastCB(t("lưu thành công"));
          },
          fail: () => {
            dangerToastCB(t("lưu không thành công"));
          }
        })
      }
    })
  }

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Retry title={t("Gặp sự cố")} onClick={refresh}/>
    } else {
      return (
        <div className="flex-v">
          <RichTextEditor field="biography" observer={observer} disabled={!permissions.canModerate}/>
          <div className="center">
            <Button size="small" variant="primary" onClick={onSave} className={classNames(!permissions.canModerate && "hide")}>
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