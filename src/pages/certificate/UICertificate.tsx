import React from "react";
import { useLocation } from "react-router-dom";
import { t } from "i18next";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";
import { List, Stack, Text, useNavigate } from "zmp-ui";

import { EFamilyTreeApi, FailResponse } from "utils";
import { Header, CommonIcon } from "components";

export function UICertificate() {
  const location = useLocation();
  const { certificateGroupId, certificateGroupName } = location.state || {  
    certificateGroupId: 0, 
    certificateGroupName: ""
  };

  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ certificates, setCertificates ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      if (typeof result === "string") {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setCertificates(result["data"] || [] as any[]);
      }
    }
    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    }

    EFamilyTreeApi.getCerificatesByGroup(phoneNumber, certificateGroupId, success, fail);
  }, [ reload ])

  const navigateToCertificateDetail = (certificateId: number) => {
    navigate("/certificate-info", { state: { certificateId } });
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