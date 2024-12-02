import React from "react";

import { t } from "i18next";
import { Header, SizedBox } from "components";
import { Stack, Text } from "zmp-ui";

/** Bảng Vàng */
export default function UICerificate() {
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