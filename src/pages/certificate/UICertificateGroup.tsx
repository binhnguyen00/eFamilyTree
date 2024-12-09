import React from "react";

import { t } from "i18next";
import { Header, SizedBox } from "components";
import { phoneState } from "states";
import { useRecoilValue } from "recoil";
import { Stack, Text, useNavigate } from "zmp-ui";
import { EFamilyTreeApi, FailResponse } from "utils";

/** Bảng Vàng */
export function UICerificateGroup() {

  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ groups, setGroups ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      if (typeof result === "string") {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setGroups(result["data"] || [] as any[]);
      }
    }
    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    }

    EFamilyTreeApi.getCerificateGroups(phoneNumber, success, fail);
  }, [ reload ])

  const onSelectGroup = (certificateGroupId: number, certificateGroupName: string) => () => {
    navigate("/certificates", { state: { certificateGroupId, certificateGroupName } });
  }

  const renderCertificateGroup = () => {
    let html = [] as React.ReactNode[];
    if (groups.length) 
      groups.forEach((group, index) => {
        html.push(
          <SizedBox 
            key={index} 
            width={"100%"} 
            height={150} 
            border 
            center
            className="button" 
            onClick={onSelectGroup(group.id, group.name)}
          >
            <Text className="text-capitalize">
              {group.name}
            </Text>
          </SizedBox>
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