import React from "react";
import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { Page } from "zmp-ui";

export function UIDummyUpcoming() {
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader("Upcoming")}
      <div className="container">
        <p> Upcoming </p>
        <p> - News </p>
        <p> - Income and Expense fund </p>
        <p> - Hall of Fame </p>
      </div>
    </div>
  )
}