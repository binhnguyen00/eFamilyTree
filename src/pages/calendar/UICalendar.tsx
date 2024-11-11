import React from "react";
import { t } from "i18next";
import { Box, Calendar, Stack, Text } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { CalendarUtils } from "../../utils/CalendarUtils";
import { CommonComponentUtils } from "../../components/common/CommonComponentUtils";
import { FailResponse } from "../../utils/Interface";

interface Event {
  name: string;
  dong_ho: string;
  id: number;
  date_begin: string; // format: DD/MM/YYYY HH:mm:ss
  date_end: string; // format: DD/MM/YYYY HH:mm:ss
  dia_diem: string;
  note: string;
}

function UICalendar() {
  const phoneNumber = useRecoilValue(phoneState);

  const [ events, setEvents ] = React.useState<Event[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {

    const success = (result: any[] | string) => {
      if (typeof result === 'string') {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        const todayEvents = CalendarUtils.filterEventsByDate(result, new Date());
        setEvents(todayEvents);
      }
    }

    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
      setFetchError(true);
    } 

    EFamilyTreeApi.getMemberUpcomingEvents(phoneNumber, success, fail);
  }, [ reload ]);

  const handleDateSelect = (selectedDate: Date) => {
    let eventsOnDate: any[] = CalendarUtils.filterEventsByDate(events, selectedDate);
    setEvents(eventsOnDate);
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

  const renderCalendar = () => {
    if (events.length > 0) {
      return (
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
            {renderDetails(events)}
          </div>
        </div>
      )
    } else {
      if (fetchError) {
        return CommonComponentUtils.renderError(t("server_error"), () => setReload(!reload));
      } else return CommonComponentUtils.renderLoading(t("no_calendar_events"));
    }
  }

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
      {CommonComponentUtils.renderHeader(t("calendar"))}

      {renderCalendar()}
    </div>
  )
}

export default UICalendar;