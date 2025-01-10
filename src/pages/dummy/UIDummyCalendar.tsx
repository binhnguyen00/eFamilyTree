import React from "react";
import { t } from "i18next";
import { Calendar, Text, Box, Stack } from "zmp-ui";

import { CalendarUtils, Event } from "utils/CalendarUtils";
import { Header, SizedBox } from "components";

import data from "./sample/events.json";

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
            <div style={{borderBottom: "0.5px solid"}} className="pt-1 pb-2">
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
      <Header  title={t("calendar")}/>

      <Stack space="0.5rem">

        <Calendar 
          cellRender={renderCell} 
          onSelect={handleDateSelect} 
        />

        <div className="scroll-h calendar-content">
          {renderDetails(selectedInfo)}
        </div>

      </Stack>
    </div>
  );
};