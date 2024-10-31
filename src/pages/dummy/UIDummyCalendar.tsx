import React from "react";
import { Calendar, Page } from "zmp-ui"; 
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIDummyCalendar() {
  return (
    <Page className='page' style={{ marginTop: 44 }}>
      {CommonComponentUtils.renderHeader("Calendar")}
      <Calendar
        fullscreen
      />
    </Page>
  )
}