import React from "react";
import { Calendar } from "zmp-ui"; 
import { renderHeader } from "../../utils/common";

export function UIDummyCalendar() {
  return (
    <div className="page">
      {renderHeader("Calendar")}
      <Calendar
        fullscreen
      />
    </div>
  )
}