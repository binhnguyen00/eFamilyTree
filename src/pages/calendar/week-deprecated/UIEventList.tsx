import React from "react";
import { t } from "i18next";
import { Sheet, Text } from "zmp-ui";

import { DateTimeUtils, DivUtils } from "utils";
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

  const renderEvents = () => {
    const eventLines = React.useMemo(() => {
      const lines = events.map((event, idx) => (
        <>
          <div 
            key={event.id || idx}
            className="flex-v p-3"
            onClick={() => setSelectedEvent(event)}
          >
            <Text.Title className="button"> {event["name"]} </Text.Title>
            <small className="flex-h">
              <span className="bold"> {DateTimeUtils.toDisplayTimeHour(event["from_date"])}  </span>
              {" - "}
              <span> {DateTimeUtils.toDisplayTimeHour(event["to_date"])} </span> 
            </small>
          </div>

          <hr/>
        </>
      )) as React.ReactNode[];

      return lines;
    }, [ events ]);

    if (!eventLines.length) return (
      <Text.Title className="center p-3"> {t("no_calendar_events")} </Text.Title>
    )
    else return eventLines;
  }

  return (
    <>
      <div className="flev-v">
        {renderEvents()}
      </div>
      <Sheet
        visible={selectedEvent ? true : false}
        className="bg-white text-base"
        onClose={() => setSelectedEvent(null)}
        height={DivUtils.calculateHeight(50)}
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