import React from "react";

import { t } from "i18next";
import { Header, SizedBox } from "components";
import { phoneState } from "states";
import { useRecoilValue } from "recoil";
import { Stack, Text, useNavigate } from "zmp-ui";
import { EFamilyTreeApi, FailResponse } from "utils";

/** Bảng Vàng */
export default function UICerificate() {
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
        setCertificates(result["certificates"] || []);

        console.log(result);
      }
    }
    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    }

    EFamilyTreeApi.getCerificates(phoneNumber, success, fail);
  }, [ reload ])

  const renderCertificate = () => {
    return (
      <Stack space="1rem">
        <SizedBox width={"100%"} height={100} border className="button">
          <Text className="text-capitalize">
            {"nhân vật lịch sử"}
          </Text>
        </SizedBox>
        <SizedBox width={"100%"} height={100} border className="button">
          <Text className="text-capitalize"> 
            {"người hiếu học"} 
          </Text>
        </SizedBox>
        <SizedBox width={"100%"} height={100} border className="button">
          <Text className="text-capitalize">
            {"người có công"}
          </Text>
        </SizedBox>
        <SizedBox width={"100%"} height={100} border className="button">
          <Text className="text-capitalize">
            {"người thành đạt"}
          </Text>
        </SizedBox>
        <SizedBox width={"100%"} height={100} border className="button">
          <Text className="text-capitalize">
            {"tấm lòng vàng"}
          </Text>
        </SizedBox>
      </Stack>
    )
  }

  return (
    <div className="container">
      <Header title={t("certificates")}/>

      {renderCertificate()}
    </div>
  )
}