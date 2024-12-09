import React from "react";
import { t } from "i18next";
import { Box, Calendar, Stack, Text } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CalendarUtils } from "utils/CalendarUtils";
import { FailResponse } from "utils/type";

import { Header, SizedBox } from "components";

export function UICalendar() {
  const phoneNumber = useRecoilValue(phoneState);

  const [ eventOnDate, setEventOnDate ] = React.useState<any[]>([]);
  const [ events, setEvents ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {

    const success = (result: any[] | string) => {
      if (typeof result === 'string') {
        console.warn(result);
      } else {
        const data = result["data"] || [];
        setEvents(data);
      }
    }

    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
    } 

    EFamilyTreeApi.getMemberUpcomingEvents(phoneNumber, success, fail);
  }, [ reload ]);

  const handleDateSelect = (selectedDate: Date) => {
    let eventsOnDate: any[] = CalendarUtils.filterEventsByDate(events, selectedDate);
    setEventOnDate(eventsOnDate);
  };

  const renderCell = (dateInCell: Date) => {
    let eventsOnDate: any[] = CalendarUtils.filterEventsByDate(events, dateInCell);

    return (
      <Box>
        {eventsOnDate.length > 0 && (
          <Box
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: "#ff5c5c", // Dot color for events
              margin: "4px auto 0", // Center dot below date
            }}
          />
        )}
      </Box>
    );
  };

  const renderDetails = (events: any[]) => {
    if (!events.length) return <Text.Title className="pt-1"> {t("no_calendar_events")} </Text.Title>
    return (
      <div className="flex-v"> 
        {events.map((event) => (
          <SizedBox 
            key={event.id} 
            height={"inherit"} width={"100%"} 
            center={false} 
            className="text-wrap"
          >
            <div style={{borderBottom: "0.5px solid"}} className="pt-2 pb-2">
              <Text.Title>{event.name}</Text.Title>
              <Text size="small">
                {`${t("place")}: ${event.dia_diem}`}
              </Text>
              <Text size="small">
                {`${t("time")}: ${event.date_begin} - ${event.date_end}`}
              </Text>
            </div>
          </SizedBox>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <Header title={t("calendar")}/>

      <div className="flex-v">

        <Calendar 
          cellRender={renderCell} 
          onSelect={handleDateSelect} 
        />

        <div className="scroll-h calendar-content">
          {renderDetails(eventOnDate)}
        </div>

      </div>
    </div>
  )
}