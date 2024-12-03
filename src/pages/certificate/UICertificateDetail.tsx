import React from "react";
import { t } from "i18next";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { phoneState } from "states";

import { Input, Stack } from "zmp-ui";

import { EFamilyTreeApi, FailResponse } from "utils";
import { Header } from "components";

export default function UICertificateDetail() {
  const location = useLocation();
  const { certificateId } = location.state || null;

  const phoneNumber = useRecoilValue(phoneState);

  const [ certificate, setCertificate ] = React.useState<any>({});
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      if (typeof result === "string") {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setCertificate(result["data"] || {
          id: null,
          name: "",
          clan: "",
          member: "",
          recordeddate: "",
          achievement: "",
          ranking: ""
        });
      }
    }
    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    }
    EFamilyTreeApi.getCerificateInfo(phoneNumber, certificateId, success, fail);
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