import React from "react";
import { t } from "i18next";

import { HallOfFameApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { Header, ImageWithText, Info, Loading } from "components";

import { ServerResponse } from "types/server";

import nguoi_co_cong from "assets/img/hall-of-fame/người-có-công.jpg";
import nguoi_hieu_hoc from "assets/img/hall-of-fame/người-hiếu-học.jpg";
import nguoi_thanh_dat from "assets/img/hall-of-fame/người-thành-công.jpg";
import nhan_vat_lich_su from "assets/img/hall-of-fame/nhân-vật-lịch-sử.jpg";
import tam_long_vang from "assets/img/hall-of-fame/tấm-lòng-vàng.jpg"

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
    switch (target) {
      case "nhân vật lịch sử":
        return nhan_vat_lich_su;
      case "người thành đạt":
        return nguoi_thanh_dat;
      case "người hiếu học":
        return nguoi_hieu_hoc;
      case "người có công":
        return nguoi_co_cong;
      case "tấm lòng vàng":
        return tam_long_vang;
      default:
        return nhan_vat_lich_su;
    }
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
      <div className="flex-v">
        {html}
      </div>
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

      <div className="container bg-white">
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