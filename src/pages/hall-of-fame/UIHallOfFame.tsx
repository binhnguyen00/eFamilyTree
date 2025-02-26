import React from "react";
import { t } from "i18next";

import { HallOfFameApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { Header, ImageWithText, Info, Loading, ScrollableDiv } from "components";

import { ServerResponse } from "types/server";
import { StyleUtils } from "utils";

import { loadHallOfFameThumnails } from "./thumnails";

export function UIHallOfFame() {
  const { goTo } = useRouteNavigate();
  const { data, error, loading, refresh } = useHallOfFame();

  const onSelect = (id: number, name: string) => () => {
    goTo({ 
      path:"hall-of-fame/users", 
      data: { hallOfFameId: id, hallOfFameName: name }
    });
  }

  const filterBackgroundByName = (name: string) => {
    const target = name.toLowerCase().trim();
    return loadHallOfFameThumnails(target);
  }

  const renderCards = () => {
    const html: React.ReactNode[] = data.map((group, index) => {
      return (
        <ImageWithText
          className="border rounded button"
          text={<h1 className="text-capitalize"> {group.name} </h1>}
          textStyle={{ fontSize: "1.5rem" }}
          src={filterBackgroundByName(group.name)}
          onClick={onSelect(group.id, group.name)}
        />
      )
    })
    return (
      <ScrollableDiv
        className="flex-v"
        direction="vertical"
        height={StyleUtils.calComponentRemainingHeight(0)}
      >
        {html}
      </ScrollableDiv>
    ) 
  }

  const renderContainer = () => {
    if (loading) {
      return <Loading />
    } else if (error) {
      return <Info title={t("chưa có bảng vàng")}/>
    } else if (!data.length) {
      return <Info title={t("chưa có bảng vàng")}/>
    } else {
      return renderCards();
    }
  }

  return (
    <>
      <Header title={t("certificates")}/>

      <div className="container bg-white max-h">
        {renderContainer()}   
      </div>
    </>
  )
}

function useHallOfFame() {
  const { userInfo } = useAppContext();

  const [ data, setData ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setData([])

    HallOfFameApi.getClanHallOfFame({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "error") {
          console.error(result.message);
          setError(true);
        } else {
          const data = result.data as any[];
          setData(data);
        }
      },
      fail: () => {
        setError(true);
        setLoading(false);
      }
    });
  }, [ reload ])

  return { data, loading, error, refresh };
}