import React from "react";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { Input, Stack } from "zmp-ui";

import { CertificateApi } from "api";
import { Header } from "components";
import { useAppContext } from "hooks";
import { FailResponse, ServerResponse } from "server";

export function UICertificateDetail() {
  const location = useLocation();
  const { certificateId } = location.state || null;
  const { userInfo } = useAppContext();
  const [ certificate, setCertificate ] = React.useState<any>({
    name: "",
    clan: "",
    member: "",
    recordeddate: "",
    achivement: "",
    ranking: ""
  });
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
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
    CertificateApi.getInfo(userInfo.id, userInfo.clanId, certificateId, success, fail);
  }, [ reload ])

  return (
    <div className="container">
      <Header title={certificate.name || t("unknown")}/>

      <Stack space="0.5rem">
        <Input label={t("clan")} value={certificate.clan} name="clan"/>
        <Input label={t("family_member")} value={certificate.member} name="member"/>
        <Input label={t("date")} value={certificate.recognition_date} name="recognition date"/>
        <Input label={t("achivement")} value={certificate.achievement} name="achievement"/>
        <Input label={t("ranking")} value={certificate.ranking} name="ranking"/>
      </Stack>
    </div>
  )
}