import React from "react";
import { t } from "i18next";
import { Header, SizedBox } from "components";
import { Stack, Text } from "zmp-ui";


export default function UIUpcomming() {
  return (
    <div className="container">
      <Header title={t("upcoming")}/>

      <UIUpcommingList/>
    </div>
  )
}

function UIUpcommingList() {
  return (
    <>
      <Stack space="0.5rem" className="center text-capitalize">
        <SizedBox 
          className="button"
          width={"100%"} 
          height={300} 
          border
        >
          <Text> {t("hall_of_fame")} </Text>
        </SizedBox>
      </Stack>
    </>
  )
}