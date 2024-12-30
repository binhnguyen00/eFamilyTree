import React from "react";
import { Box, Input, List, Sheet, Stack, Text } from "zmp-ui";

import { CertificateApi } from "api";
import { FailResponse, ServerResponse } from "server";
import { Header, CommonIcon, AppContext } from "components";
import { useRouteNavigate } from "hooks";
import { t } from "i18next";
import { CommonUtils } from "utils";

export function UICertificate() {
  const { belongings } = useRouteNavigate();
  const { certificateGroupId, certificateGroupName } = belongings || {  
    certificateGroupId: 0, 
    certificateGroupName: ""
  };
  const { phoneNumber } = React.useContext(AppContext);
  const [ certificates, setCertificates ] = React.useState<any[]>([]);
  const [ certificate, setCertificate ] = React.useState<any>(null);
  
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

  const showCeriticateInfo = (id: number) => {
    const success = (result: ServerResponse) => {
      if (result.status === "error") {
        console.error("UICertificateDetail:\n\t", result.message);
      } else {
        const data = result.data as any;
        setCertificate(data);
      }
    }
    const fail = (error: FailResponse) => {
      console.error("UICertificateDetail:\n\t", error.stackTrace);
    }
    CertificateApi.getInfo(phoneNumber, id, success, fail);
  }

  const renderCertificate = () => {
    let html = [] as React.ReactNode[];
    certificates.forEach((certificate: any, index: number) => {
      html.push(
        <Box
          onClick={() => showCeriticateInfo(certificate["id"])}
          flex flexDirection="row" justifyContent="space-between"
          className="bg-secondary text-primary p-3 rounded mt-2"
        >
          <div>
            <Text.Title> {certificate["member"]} </Text.Title>
            <Text> {certificate["name"]} </Text>
          </div>
          <CommonIcon.ChevonRight size={20}/>
        </Box>
      )
    })
    return (
      <>
        <Stack space="1rem">
          {html}
        </Stack>

        {!CommonUtils.isNullOrUndefined(certificate) && (
          <UICertificateDetail
            info={certificate}
            visible={!CommonUtils.isNullOrUndefined(certificate)}
            onClose={() => setCertificate(null)}
          />
        )}
      </>
    )
  }

  return (
    <div className="container">
      <Header title={certificateGroupName}/>

      {renderCertificate()}
    </div>
  )
}


interface UICertificateDetailProps {
  visible: boolean;
  info: any;
  onClose: () => void;
}
function UICertificateDetail(props: UICertificateDetailProps) {
  const { visible, info, onClose } = props;

  return (
    <Sheet
      visible={visible} mask autoHeight handler swipeToClose
      onClose={onClose} 
      title={info["name"] || t("member_info")}
    >
      <Box className="p-2" style={{ maxHeight: "50vh" }}>
        <Input label={t("clan")} value={info.clan} name="clan"/>
        <Input label={t("family_member")} value={info.member} name="member"/>
        <Input label={t("date")} value={info.recognition_date} name="recognition date"/>
        <Input label={t("achivement")} value={info.achievement} name="achievement"/>
        <Input label={t("ranking")} value={info.ranking} name="ranking"/>
      </Box>
    </Sheet>
  )
}