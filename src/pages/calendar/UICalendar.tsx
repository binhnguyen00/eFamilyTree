import React from "react";
import { t } from "i18next";
import { Tabs } from "zmp-ui";

import { Header, MonthCalendar, WeekCalendar } from "components";

export function UICalendar() {
  return (
    <div className="container-padding text-base">
      <Header title={t("calendar")}/>

      <UICalenderContainer/>
    </div>
  )
}

function UICalenderContainer() {
  const TabLabel = ({ title }: { title: string }) => {
    return <p className="text-capitalize"> {t(title)} </p>
  }

  return (
    <Tabs defaultActiveKey="clan-events">

      <Tabs.Tab key={"clan-events"} label={<TabLabel title={"Sự kiện"}/>}>
        <WeekCalendar/>
      </Tabs.Tab>
      
      <Tabs.Tab key={"lucky-day"} label={<TabLabel title={"Lịch Vạn Niên"}/>}>
        <MonthCalendar />
      </Tabs.Tab>

    </Tabs>
  )
}