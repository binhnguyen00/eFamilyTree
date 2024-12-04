import React from "react";
import { t } from "i18next";
import { Calendar, Text, Box, Stack } from "zmp-ui";

import { CalendarUtils, Event } from "utils/CalendarUtils";

import { Header } from "components";

import data from "pages/calendar/sample/events.json";

export default function UIDummyCalendar() {
  const [selectedInfo, setSelectedInfo] = React.useState<Event[]>([]);

  const handleDateSelect = (selectedDate: Date) => {
    let eventsOnDate: any[] = CalendarUtils.filterEventsByDate(data, selectedDate);
    console.log(eventsOnDate);
    setSelectedInfo(eventsOnDate);
  };

  React.useEffect(() => {
    const todayEvents = CalendarUtils.filterEventsByDate(data, new Date());
    setSelectedInfo(todayEvents);
  }, []);

  const renderCell = (dateInCell: Date) => {
    let eventsOnDate: any[] = CalendarUtils.filterEventsByDate(data, dateInCell);

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
    if (!events.length) return <Text className="mt-2 mb-2"> {t("no_calendar_events")} </Text>
    return (
      <Stack className="mt-2 mb-2"> 
        {events.map((event) => (
          <Box key={event.id} flex flexDirection="column" flexWrap>
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
      <Header  title={t("calendar")}/>

      <div className="flex-v">
        <Calendar 
          cellRender={renderCell} 
          onSelect={handleDateSelect} 
        />
        {renderDetails(selectedInfo)}
      </div>
    </div>
  );
};