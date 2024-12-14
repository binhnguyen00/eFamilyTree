import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { List, Stack, Text } from "zmp-ui";

import { Header, CommonIcon, AutoLoginContext } from "components";
import { EFamilyTreeApi, FailResponse, ServerResponse } from "utils";

export function UICertificate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { certificateGroupId, certificateGroupName } = location.state || {  
    certificateGroupId: 0, 
    certificateGroupName: ""
  };
  const { phone } = React.useContext(AutoLoginContext);
  const [ certificates, setCertificates ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      if (result.status === "error") {
        console.error("UICertificate:\n\t", result.message);
      } else {
        const data = result.data as any[];
        setCertificates(data);
      }
    }
    const fail = (error: FailResponse) => {
      console.error("UICertificate:\n\t", error.stackTrace);
    }

    EFamilyTreeApi.getCerificatesByGroup(phone, certificateGroupId, success, fail);
  }, [ reload ])

  const navigateToCertificateDetail = (certificateId: number) => {
    navigate("/certificate/list/info", { state: { certificateId } });
  }

  const renderCertificate = () => {
    let html = [] as React.ReactNode[];
    certificates.forEach((certificate: any, index: number) => {
      html.push(
        <List.Item
          key={index}
          className="button"
          suffix={<CommonIcon.ChevonRight size={15}/>}
          onClick={() => navigateToCertificateDetail(certificate.id)}
        >
          <Text.Title> {certificate["name"]} </Text.Title>
          <Text> {certificate["member"]} </Text>
        </List.Item>
      )
    })
    return (
      <Stack space="1rem">
        {html}
      </Stack>
    )
  }

  return (
    <div className="container">
      <Header title={certificateGroupName}/>

      {renderCertificate()}
    </div>
  )
}