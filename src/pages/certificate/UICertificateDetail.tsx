import React from "react";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { Input, Stack } from "zmp-ui";

import { AutoLoginContext, Header } from "components";
import { EFamilyTreeApi, FailResponse, ServerResponse } from "utils";

export function UICertificateDetail() {
  const location = useLocation();
  const { certificateId } = location.state || null;
  const { phone } = React.useContext(AutoLoginContext);
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
    EFamilyTreeApi.getCerificateInfo(phone, certificateId, success, fail);
  }, [ reload ])

  return (
    <div className="container">
      <Header title={certificate.name || t("unknown")}/>

      <Stack space="0.5rem">
        <Input label={t("clan")} value={certificate.clan} name="clan"/>
        <Input label={t("family_member")} value={certificate.member} name="member"/>
        <Input label={t("date")} value={certificate.recordeddate} name="recordeddate"/>
        <Input label={t("achivement")} value={certificate.achivement} name="achivement"/>
        <Input label={t("ranking")} value={certificate.ranking} name="ranking"/>
      </Stack>
    </div>
  )
}