import React from "react";
import { t } from "i18next";

import { DivUtils } from "utils";
import { HallOfFameApi } from "api";
import { ServerResponse } from "types";
import { useAppContext, useRouteNavigate } from "hooks";
import { Header, ImageWithText, Info, Loading, Retry, ScrollableDiv } from "components";

import { loadHallOfFameThumnails, getHallOfFameTextStyle } from "./thumnails";

export function UIHallOfFame() {
  const { goTo } = useRouteNavigate();
  const { data, error, loading, refresh } = useHallOfFame();

  const onSelect = (id: number, name: string) => () => {
    goTo({ 
      path:"hall-of-fame/users", 
      belongings: { 
        hallOfFameId: id, 
        hallOfFameName: name 
      }
    });
  }

  const filterBackgroundByName = (name: string) => {
    const target = name.toLowerCase().trim();
    return loadHallOfFameThumnails(target);
  }

  const getTextStyleForCategory = (name: string) => {
    const target = name.toLowerCase().trim();
    const style = getHallOfFameTextStyle(target);
    
    // Base text style
    const textStyle: React.CSSProperties = {
      fontSize: style.fontSize || "1.8rem",
      fontWeight: "bold",
      maxWidth: '90%',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
      padding: '6px 12px',
      borderRadius: '8px',
      backgroundColor: style.backgroundColor,
      lineHeight: style.lineHeight || 1.2,
      textAlign: "center",
      width: "auto",
      letterSpacing: "0.5px"
    };
    
    // Position adjustments
    if (style.textPosition === "top") {
      textStyle.top = "30%";
    } else if (style.textPosition === "bottom") {
      textStyle.top = "70%";
    }
    
    return textStyle;
  }

  const renderCards = () => {
    const html: React.ReactNode[] = data.map((group, index) => {
      return (
        <div key={group.id}>
          <ImageWithText
            className="border-secondary rounded button"
            text={<h1 className="text-capitalize text-center m-0 p-0"> {group.name} </h1>}
            textStyle={getTextStyleForCategory(group.name)}
            src={filterBackgroundByName(group.name)}
            onClick={onSelect(group.id, group.name)}
            width="100%"
          />
        </div>
      )
    })
    return html;
  }

  const renderContainer = () => {
    if (loading) {
      return <Loading />
    } else if (error) {
      return <Retry title={t("Chưa có bảng vàng")} onClick={() => refresh()}/>
    } else if (!data.length) {
      return <Info title={t("Chưa có bảng vàng")}/>
    } else {
      return (
        <ScrollableDiv className="flex-v" direction="vertical" height={DivUtils.calculateHeight(0)}>
          <br/>
          {renderCards()}
          <br/> <br/>
        </ScrollableDiv>
      );
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
