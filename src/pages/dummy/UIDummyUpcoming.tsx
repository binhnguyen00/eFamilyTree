import React from "react";
import { renderHeader } from "../../utils/common";

export function UIDummyUpcoming() {
  return (
    <div>
      {renderHeader("Upcoming")}
      <p> Upcoming </p>
      <p> - News </p>
      <p> - Income and Expense fund </p>
      <p> - Hall of Fame </p>
    </div>
  )
}