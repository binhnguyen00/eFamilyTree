import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar, Page } from "zmp-ui"; 
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIDummyCalendar() {
  const { t } = useTranslation();

  return (
    <Page>
      {CommonComponentUtils.renderHeader(t("calendar"))}
      <Calendar 
        className="container"
        fullscreen
        
      />
    </Page>
  )
}