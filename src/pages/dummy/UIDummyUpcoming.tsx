import React from "react";
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIDummyUpcoming() {
  return (
    <div>
      {CommonComponentUtils.renderHeader("Upcoming")}
      <p> Upcoming </p>
      <p> - News </p>
      <p> - Income and Expense fund </p>
      <p> - Hall of Fame </p>
    </div>
  )
}