import React from "react";
import { Calendar, Page } from "zmp-ui"; 
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIDummyCalendar() {
  return (
    <Page>
      {CommonComponentUtils.renderHeader("Calendar")}
      <Calendar 
        className="container"
        fullscreen
      />
    </Page>
  )
}