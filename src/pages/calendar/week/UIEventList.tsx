import React from "react";
import { t } from "i18next";
import { Sheet, Stack, Text } from "zmp-ui";

import { DateTimeUtils, StyleUtils } from "utils";
import { UIEventDetails } from "./UIEventDetails";

interface UIEventListProps {
  activeMembers: {
    value: number;
    label: string;
  }[];
  events: any[];
  onReloadParent?: () => void;
}
export function UIEventList(props: UIEventListProps) { 
  const { activeMembers, events, onReloadParent } = props;
  const [ selectedEvent, setSelectedEvent ] = React.useState<any | null>(null);

  const line = events.map((event, idx) => (
    <div 
      key={event.id || idx}
      className="flex-h justify-between border-bottom align-center"
      onClick={() => setSelectedEvent(event)}
    >
      <Text size="large" className="bold button">
        {event["name"]}
      </Text>
      <div className="flex-v align-end">
        <small className="bold"> 
          {t("Từ")} {DateTimeUtils.toDisplayTime(event["from_date"])} 
        </small>
        <small> 
          {t("Đến")} {DateTimeUtils.toDisplayTime(event["to_date"])} 
        </small>
      </div>
    </div>
  )) as React.ReactNode[];

  return (
    <>
      <Stack space="0.5rem" className="p-2">
        {line.length ? (
          <> {line} </>
        ): (
          <span className="center"> {t("no_calendar_events")} </span>
        )}
      </Stack>
      <Sheet
        visible={selectedEvent ? true : false}
        className="bg-white text-base"
        onClose={() => setSelectedEvent(null)}
        height={StyleUtils.calComponentRemainingHeight(0)}
        title={t("event_details")}
      >
        <UIEventDetails
          activeMembers={activeMembers}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onReloadParent={onReloadParent}
        />
      </Sheet>
    </>
  )
}

