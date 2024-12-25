import React from "react";
import { List, Stack, Text } from "zmp-ui";

import { CertificateApi } from "api";
import { FailResponse, ServerResponse } from "server";
import { Header, CommonIcon, AppContext } from "components";
import { useRouteNavigate } from "hooks";

export function UICertificate() {
  const { goTo, belongings } = useRouteNavigate();
  const { certificateGroupId, certificateGroupName } = belongings || {  
    certificateGroupId: 0, 
    certificateGroupName: ""
  };
  const { phoneNumber } = React.useContext(AppContext);
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

    CertificateApi.getByGroup(phoneNumber, certificateGroupId, success, fail);
  }, [ reload ])

  const navigateToCertificateDetail = (certificateId: number) => {
    goTo("certificate/list/info", { certificateId });
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