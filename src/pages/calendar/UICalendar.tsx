import React from "react";
import { t } from "i18next";
import { Box, Calendar, Stack, Text } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { DateTimeUtils } from "../../utils/DateTimeUtils";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { PhoneNumberContext } from "../../pages/main";

interface Event {
  name: string;
  dong_ho: string;
  id: number;
  date_begin: string;
  date_end: string;
  dia_diem: string;
  note: string;
}

export function UICalendar() {
  const phoneNumber = React.useContext(PhoneNumberContext);

  // states
  const [ data, setData ] = React.useState<any[]>([]);
  const [ events, setEvents ] = React.useState<Event[]>([]);
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {

    const success = (result: any[] | string) => {
      setLoading(false);
      if (typeof result === 'string') {
        setFetchError(true);
      } else {
        setData(result);
      }
    }

    const fail = (error: any) => {
      setLoading(false);
      setFetchError(true);
    } 

    const fetchData = () => {
      setLoading(true);
      setFetchError(false);
      EFamilyTreeApi.getMemberUpcomingEvents(phoneNumber, success, fail);
    };

    fetchData();
  }, [ reload, phoneNumber ]);

  const handleDateSelect = (selectedDate: Date) => {
    let eventsOnDate: any[] = [];
    const date = DateTimeUtils.formatFromDate(selectedDate, "DD/MM/YYYY HH:mm:ss");

    data.forEach((event) => {
      const eventStart = DateTimeUtils.formatFromString(event.date_begin, "DD/MM/YYYY HH:mm:ss");
      const eventEnd = DateTimeUtils.formatFromString(event.date_end, "DD/MM/YYYY HH:mm:ss");
      if (date >= eventStart && date <= eventEnd) {
        eventsOnDate.push(event);
      }
    });

    const e = eventsOnDate.filter((event) => {
      const eventStart = DateTimeUtils.formatFromString(event.date_begin, "DD/MM/YYYY HH:mm:ss");
      const eventEnd = DateTimeUtils.formatFromString(event.date_end, "DD/MM/YYYY HH:mm:ss");
      if (date >= eventStart && date <= eventEnd) return event;
    });

    setEvents(e);
  };

  const renderCell = (dateInCell: Date) => {
    const date = DateTimeUtils.currentTime(dateInCell);
    
    let eventsOnDate: any[] = [];
    data.forEach((event) => {
      const eventStart = DateTimeUtils.formatFromString(event.date_begin, "DD/MM/YYYY HH:mm:ss");
      const eventEnd = DateTimeUtils.formatFromString(event.date_end, "DD/MM/YYYY HH:mm:ss");
      if (date >= eventStart && date <= eventEnd) eventsOnDate.push(event);
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

  const renderCalendar = () => {
    if (loading) {
      return CommonComponentUtils.renderLoading(t("loading_calendar"));
    } else if (fetchError) {
      return CommonComponentUtils.renderError(t("server_error"), () => setReload((prev) => !prev));
    } else {
      if (data.length > 0) {
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
      } else return CommonComponentUtils.renderError(t("no_calendar_events"), () => setReload((prev) => !prev));
    }
  }

  const renderDetails = (events: Event[]) => {
    if (!events.length) return <Text>{t("no_calendar_events")}</Text>;

    return (
      <Stack space=""> 
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