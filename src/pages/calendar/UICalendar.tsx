import React from "react";
import { t } from "i18next";
import { Tabs } from "zmp-ui";

import { Header } from "components";

import { UIWeekCalendar } from "./UIWeekCalendar";
import { UIMonthCalendar } from "./UIMonthCalendar";

export function UICalendar() {
  return (
    <div className="container-padding text-base">
      <Header title={t("calendar")}/>

      <Tabs defaultActiveKey="clan-events">

        <Tabs.Tab key={"clan-events"} label={<p className="text-capitalize"> {t("Sự kiện")} </p>}>
          <UIWeekCalendar/>
        </Tabs.Tab>
        
        <Tabs.Tab key={"lucky-day"} label={<p className="text-capitalize"> {t("Lịch Vạn Niên")} </p>}>
          <UIMonthCalendar/>
        </Tabs.Tab>

      </Tabs>
    </div>
  )
}