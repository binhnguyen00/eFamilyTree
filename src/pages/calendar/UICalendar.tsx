import React from "react";
import { t } from "i18next";
import { Box, Calendar, Stack, Text } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CalendarUtils } from "utils/CalendarUtils";
import { FailResponse } from "utils/type";

import { Header } from "components";

interface Event {
  name: string;
  dong_ho: string;
  id: number;
  date_begin: string; // format: DD/MM/YYYY HH:mm:ss
  date_end: string; // format: DD/MM/YYYY HH:mm:ss
  dia_diem: string;
  note: string;
}

export default function UICalendar() {
  const phoneNumber = useRecoilValue(phoneState);

  const [ eventOnDate, setEventOnDate ] = React.useState<Event[]>([]);
  const [ events, setEvents ] = React.useState<Event[]>([]);
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

  const renderDetails = (events: Event[]) => {
    if (!events.length) return <Text>{t("no_calendar_events")}</Text>;

    return (
      <Stack> 
        {events.map((event) => (
          <Box key={event.id} flex flexDirection="column" flexWrap style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text>{event.name}</Text>
            <Text size="small">
              Địa điểm: {event.dia_diem}
            </Text>
            <Text size="small">
              Thời gian: {event.date_begin} - {event.date_end}
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
        <div style={{ overflowY: "auto" }}>
          {renderDetails(eventOnDate)}
        </div>
      </div>
    </div>
  )
}