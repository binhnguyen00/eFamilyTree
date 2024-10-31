import React from "react";
import { Calendar, Page } from "zmp-ui"; 
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIDummyCalendar() {
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader("Calendar")}
      <Calendar
        fullscreen
      />
    </div>
  )
}