import React from "react";
import { CommonUtils } from "../../utils/common";

export function UIDummyUpcoming() {
  return (
    <div>
      {CommonUtils.renderHeader("Upcoming")}
      <p> Upcoming </p>
      <p> - News </p>
      <p> - Income and Expense fund </p>
      <p> - Hall of Fame </p>
    </div>
  )
}