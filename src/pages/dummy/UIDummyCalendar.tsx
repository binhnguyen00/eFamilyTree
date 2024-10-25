import React from "react";
import { Calendar } from "zmp-ui"; 
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIDummyCalendar() {
  return (
    <div className="page">
      {CommonComponentUtils.renderHeader("Calendar")}
      <Calendar
        fullscreen
      />
    </div>
  )
}