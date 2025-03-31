import React from "react";
import { t } from "i18next";

import { Header, MonthCalendar } from "components";

export function UIMonthCalendar() {
  return (
    <>
      <Header title={t("lịch vạn niên")}/>

      <div className="container bg-white text-base">
        <MonthCalendar/>
      </div>
    </>
  )
}