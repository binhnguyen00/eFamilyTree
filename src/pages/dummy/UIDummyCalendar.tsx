import React, { useState } from "react";
import { t } from "i18next";
import { Calendar, Text, Box, Stack } from "zmp-ui";
import { DateTimeUtils } from "utils/DateTimeUtils";
import { CommonComponentUtils } from "utils/CommonComponentUtils";

const data = [
  {
    name: "Giỗ tổ họ Nguyễn",
    dong_ho: "Nguyễn Văn",
    id: 1,
    date_begin: "04/11/2024 07:00:00",
    date_end: "10/11/2024 13:00:00",
    dia_diem: "Nhà tổ",
    note: "....",
  },
];

interface Event {
  name: string;
  dong_ho: string;
  id: number;
  date_begin: string;
  date_end: string;
  dia_diem: string;
  note: string;
}

export function UIDummyCalendar() {
  const [selectedInfo, setSelectedInfo] = useState<Event[]>([]);

  const handleDateSelect = (date: Date) => {
    let eventsOnDate: any[] = [];
    data.forEach((event) => {
      const eventStart = DateTimeUtils.formatFromString(event.date_begin.substring(0, 10), "DD/MM/YYYY");
      const eventEnd = DateTimeUtils.formatFromString(event.date_end.substring(0, 10), "DD/MM/YYYY");
      if (date >= eventStart && date <= eventEnd) {
        eventsOnDate.push(event);
      }
    });
    console.log(eventsOnDate);

    const e = eventsOnDate.filter((event) => {
      const eventStart = DateTimeUtils.formatFromString(event.date_begin.substring(0, 10), "DD/MM/YYYY");
      const eventEnd = DateTimeUtils.formatFromString(event.date_end.substring(0, 10), "DD/MM/YYYY");
      if (date >= eventStart && date <= eventEnd) return event;
    });

    setSelectedInfo(e);
  };

  const renderCell = (dateInCell: Date) => {
    const date = new Date(dateInCell);
    
    // TODO: Check if that day has events
    let eventsOnDate: any[] = [];
    data.forEach((event) => {
      const eventStart = DateTimeUtils.formatFromString(event.date_begin.substring(0, 10), "DD/MM/YYYY");
      const eventEnd = DateTimeUtils.formatFromString(event.date_end.substring(0, 10), "DD/MM/YYYY");
      if (date >= eventStart && date <= eventEnd) {
        let diffInTime = eventEnd.getTime() - eventStart.getTime();
        let diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
        for (let i = 0; i < diffInDays; i++) {
          eventsOnDate.push(event);
        }
      }
    });

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
    if (!events.length) return <Text>{t("no_events")}</Text>;

    return (
      <Stack space=""> 
        {events.map((event) => (
          <Box key={event.id} flex flexDirection="column" flexWrap style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Text>{event.name}</Text>
            <Text size="small" color="gray">
              Địa điểm: {event.dia_diem}
            </Text>
            <Text size="small" color="gray">
              Thời gian: {event.date_begin} - {event.date_end}
            </Text>
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader("Calendar")}

      <div className="flex-v">
        <Calendar 
          cellRender={renderCell} 
          onSelect={handleDateSelect} 
        />
        {/* 
        250px : height of Zalo calendar
        44px  : height of header 
        */}
        <div style={{ paddingLeft: 15, paddingRight: 15, height: `calc(100vh - 250px - 44px)`, overflowY: "auto" }}>
          {renderDetails(selectedInfo)}
        </div>
      </div>
    </div>
  );
};