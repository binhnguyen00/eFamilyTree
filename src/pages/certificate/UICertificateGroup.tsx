import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Stack, Text } from "zmp-ui";

import { AutoLoginContext, Header, SizedBox } from "components";
import { EFamilyTreeApi, FailResponse, ServerResponse } from "utils";

/** Bảng Vàng */
export function UICerificateGroup() {
  const navigate = useNavigate();
  const { phone } = React.useContext(AutoLoginContext);
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

    EFamilyTreeApi.getCerificateGroups(phone, success, fail);
  }, [ reload ])

  const onSelectGroup = (certificateGroupId: number, certificateGroupName: string) => () => {
    navigate("/certificate/list", { state: { certificateGroupId, certificateGroupName } });
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