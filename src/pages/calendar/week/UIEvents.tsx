import React from "react";
import { t } from "i18next";
import { Button, Sheet, Stack, Text } from "zmp-ui";

import { CommonIcon, Divider, useAppContext } from "components";
import { DateTimeUtils, StyleUtils } from "utils";
import { CalendarApi, FamilyTreeApi } from "api";
import { ServerResponse } from "types/server";
import { useNotification } from "hooks";

interface UIEventsProps {
  events: any[];
}
export function UIEvents(props: UIEventsProps) { 
  const { events } = props; // TODO: Sort events by from_date
  const [ selectedEvent, setSelectedEvent ] = React.useState<any>();

  const html = events.map((event, idx) => {
    return (
      <div 
        className="flex-h justify-between border-bottom align-center"
        onClick={() => setSelectedEvent(event)}
      >
        <Text size="large" className="bold button">
          {event.name}
        </Text>
        <div className="flex-v align-end">
          <small className="bold"> {DateTimeUtils.toDisplayTime(event["from_date"])} </small>
          <small> {DateTimeUtils.toDisplayTime(event["to_date"])} </small>
        </div>
      </div>
    )
  }) as React.ReactNode[];

  return (
    <>
      <Stack space="0.5rem" className="p-2">
        {html.length ? (
          <> {html} </>
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
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </Sheet>
    </>
  )
}

function UIEventDetails({ event, onClose }: { 
  event: any;
  onClose: () => void;
}) {
  const { userInfo } = useAppContext();
  const { successToast, dangerToast } = useNotification();

  const [ ids, setIds ] = React.useState<any[]>([]);

  React.useEffect(() => {
    FamilyTreeApi.getActiveMemberIds({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          const data: any[] = result.data;
          setIds(data);
        }
      }
    })
  }, [])

  const onDelete = () => {
    CalendarApi.deleteEvent({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      id: event["id"],
      successCB: (result: ServerResponse) => {
        if (result.status === "success") {
          successToast(t("Xoá Thành Công"))
        } else {
          dangerToast(t("Xoá Thất Bại"))
        }
        onClose();
      },
      failCB: () => {
        dangerToast(t("Xoá Thất Bại"))
        onClose()
      }
    })
  }

  return (
    <div className="flex-v flex-grow-0">
      <Text.Title> {event?.name} </Text.Title>

      <Divider size={0}/>

      <div>
        <p> {`
          ${t("from")} 
          ${DateTimeUtils.toDisplayTime(event?.["from_date"])}, 
          ${DateTimeUtils.toDisplayDate(event?.["from_date"])}`} </p>
        <p> {`
          ${t("to")} 
          ${DateTimeUtils.toDisplayTime(event?.["to_date"])}, 
          ${DateTimeUtils.toDisplayDate(event?.["to_date"])}
        `} </p>

        <strong> {t("Người Phụ Trách")} </strong>
        <p> {event?.["pic"]} </p>

        <Divider size={0}/>

        <strong> {t("place")} </strong>
        <p> {event?.["place"]} </p>

        <Divider size={0}/>

        <strong> {t("note")} </strong>
        <p> {event?.["note"]} </p>
      </div>

      <div className="scroll-h">
        <Button prefixIcon={<CommonIcon.Trash/>} onClick={onDelete}>
          {t("delete")}
        </Button>
      </div>
    </div>
  )
}