import React from "react";
import { t } from "i18next";

import { Header } from "components";

import { UIWeekCalendar } from "./week/UIWeekCalendar";

export function UICalendar() {
  return (
    <>
      <Header title={t("calendar")}/>
      
      <div className="container bg-white text-base">
        <UIWeekCalendar/>
      </div>
    </>
  )
}