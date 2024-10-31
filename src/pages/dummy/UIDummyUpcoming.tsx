import React from "react";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { Page } from "zmp-ui";

export function UIDummyUpcoming() {
  return (
    <Page className='page' style={{ marginTop: 44 }}>
      {CommonComponentUtils.renderHeader("Upcoming")}
      <p> Upcoming </p>
      <p> - News </p>
      <p> - Income and Expense fund </p>
      <p> - Hall of Fame </p>
    </Page>
  )
}