import React from "react";
import { Calendar } from "zmp-ui"; 
import { CommonUtils } from "../../utils/common";

export function UIDummyCalendar() {
  return (
    <div className="page">
      {CommonUtils.renderHeader("Calendar")}
      <Calendar
        fullscreen
      />
    </div>
  )
}