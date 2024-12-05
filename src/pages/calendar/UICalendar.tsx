import React from "react";
import { t } from "i18next";
import { Box, Calendar, Stack, Text } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CalendarUtils } from "utils/CalendarUtils";
import { FailResponse } from "utils/type";

import { Header } from "components";

export default function UICalendar() {
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
    if (!events.length) return <Text className="mt-2"> {t("no_calendar_events")} </Text>
    return (
      <Stack className="mt-2 mb-2" space="0.5rem"> 
        {events.map((event) => (
          <Box key={event.id} flex flexDirection="column" flexWrap style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text>{event.name}</Text>
            <Text size="small">
              {`${t("place")}: ${event.dia_diem}`}
            </Text>
            <Text size="small">
              {`${t("time")}: ${event.date_begin} - ${event.date_end}`}
            </Text>
          </Box>
        ))}
      </Stack>
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
        <div 
          className="scroll-h" 
        >
          {renderDetails(eventOnDate)}
        </div>
      </div>
    </div>
  )
}