import React from "react";
import { t } from "i18next";
import { Stack, Text } from "zmp-ui";

import { CertificateApi } from "api";
import { FailResponse, ServerResponse } from "server";
import { AppContext, Header, ImageWithText, SizedBox } from "components";
import { useRouteNavigate } from "hooks";

import nguoi_co_cong from "assets/img/certificate/người-có-công.jpg";
import nguoi_hieu_hoc from "assets/img/certificate/người-hiếu-học.jpg";
import nguoi_thanh_dat from "assets/img/certificate/người-thành-công.jpg";
import nhan_vat_lich_su from "assets/img/certificate/nhân-vật-lịch-sử.jpg";
import tam_long_vang from "assets/img/certificate/tấm-lòng-vàng.jpg"

/** Bảng Vàng */
export function UICerificateGroup() {
  const { goTo } = useRouteNavigate();
  const { phoneNumber } = React.useContext(AppContext);
  const [ groups, setGroups ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "error") {
        console.error("UICertificateGroup:\n\t", result.message);
      } else {
        const data = result.data as any[];
        setGroups(data);
      }
    }
    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
    }

    CertificateApi.getGroups(phoneNumber, success, fail);
  }, [ reload ])

  const onSelectGroup = (certificateGroupId: number, certificateGroupName: string) => () => {
    goTo("certificate/list", { certificateGroupId, certificateGroupName });
  }

  const sortGroupBgByName = (name: string) => {
    switch (name) {
      case "Nhân Vật Lịch Sử":
        return nhan_vat_lich_su;
      case "Người Thành Đạt":
        return nguoi_thanh_dat;
      case "Người Hiếu Học":
        return nguoi_hieu_hoc;
      case "Người Có Công":
        return nguoi_co_cong;
      case "Tấm Lòng Vàng":
        return tam_long_vang;
      default:
        return nhan_vat_lich_su;
    }
  }

  const renderCertificateGroup = () => {
    let html = [] as React.ReactNode[];
    if (groups.length) 
      groups.forEach((group, index) => {
        html.push(
          <ImageWithText
            className="border rounded button"
            text={<h1 className="text-capitalize"> {group.name} </h1>}
            textStyle={{ fontSize: "1.5rem" }}
            src={sortGroupBgByName(group.name)}
            onClick={onSelectGroup(group.id, group.name)}
          />
        )
      })
    if (html.length) {
      return (
        <Stack space="1rem">
          {html}
        </Stack>
      ) 
    } else {
      return (
        <Stack space="1rem">
          <SizedBox width={"100%"} height={150} border className="button">
            <Text className="text-capitalize">
              {"nhân vật lịch sử"}
            </Text>
          </SizedBox>
          <SizedBox width={"100%"} height={150} border className="button">
            <Text className="text-capitalize"> 
              {"người hiếu học"} 
            </Text>
          </SizedBox>
          <SizedBox width={"100%"} height={150} border className="button">
            <Text className="text-capitalize">
              {"người có công"}
            </Text>
          </SizedBox>
          <SizedBox width={"100%"} height={150} border className="button">
            <Text className="text-capitalize">
              {"người thành đạt"}
            </Text>
          </SizedBox>
          <SizedBox width={"100%"} height={150} border className="button">
            <Text className="text-capitalize">
              {"tấm lòng vàng"}
            </Text>
          </SizedBox>
        </Stack>
      )
    }
  }

  return (
    <div className="container">
      <Header title={t("certificates")}/>

      {renderCertificateGroup()}
    </div>
  )
}