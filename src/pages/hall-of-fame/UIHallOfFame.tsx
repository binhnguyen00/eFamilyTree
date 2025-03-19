import React from "react";
import { t } from "i18next";

import { HallOfFameApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { Divider, Header, ImageWithText, Info, Loading, ScrollableDiv } from "components";

import { ServerResponse } from "types/server";
import { StyleUtils } from "utils";

import { loadHallOfFameThumnails, getHallOfFameTextStyle } from "./thumnails";

export function UIHallOfFame() {
  const { goTo } = useRouteNavigate();
  const { data, error, loading, refresh } = useHallOfFame();

  const onSelect = (id: number, name: string) => () => {
    goTo({ 
      path:"hall-of-fame/users", 
      belongings: { hallOfFameId: id, hallOfFameName: name }
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
        <div key={group.id} className="card-container mb-3">
          <ImageWithText
            className="border rounded button"
            text={<h1 className="text-capitalize text-center m-0 p-0"> {group.name} </h1>}
            textStyle={getTextStyleForCategory(group.name)}
            src={filterBackgroundByName(group.name)}
            onClick={onSelect(group.id, group.name)}
            width="100%"
            height="170px"
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
      return <Info title={t("chưa có bảng vàng")}/>
    } else if (!data.length) {
      return <Info title={t("chưa có bảng vàng")}/>
    } else {
      return (
        <ScrollableDiv
          className="flex-v"
          direction="vertical"
          height={StyleUtils.calComponentRemainingHeight(0)}
        >
          <div className="px-3 pt-3">
            {renderCards()}
          </div>
          
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
