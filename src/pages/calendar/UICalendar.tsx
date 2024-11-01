import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Box, Calendar, Text } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { DateTimeUtils } from "../../utils/DateTimeUtils";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { PhoneNumberContext } from "../../pages/main";

export function UICalendar() {
  const { t } = useTranslation();
  const phoneNumber = React.useContext(PhoneNumberContext);

  // states
  const [ data, setData ] = React.useState<any[]>([]);
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {

    const success = (result: any[] | string) => {
      /** Success Result
        [{
          "name": "Giỗ tổ họ Nguyễn",
          "dong_ho": "Nguyễn Văn",
          "id": 12,
          "date_begin": "22/12/2024 07:00:00",
          "date_end": "22/12/2024 13:00:00",
          "address_id": "Nhà tổ",
          "note": ""
        }]
       */
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

  const renderCalendar = () => {
    if (loading) {
      return CommonComponentUtils.renderLoading(t("loading_calendar"));
    } else if (fetchError) {
      return CommonComponentUtils.renderError(t("server_error"), () => setReload((prev) => !prev));
    } else {
      if (data.length > 0) {
        return <UICalendarDetails data={data}/>
      } else return CommonComponentUtils.renderError(t("no_calendar"), () => setReload((prev) => !prev));
    }
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("calendar"))}

      {renderCalendar()}
    </div>
  )
}

function UICalendarDetails({data}: {data: any[]}) {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language; // vi / en

  // States
  const [ showDetails, setShowDetails ] = React.useState(false);

  const cellRender = (dateType: any) => {
    const today = new Date();
    const strToday = DateTimeUtils.formatToDate(today);
    const date = new Date(dateType);
    const strDate = DateTimeUtils.formatToDate(date);
    
    return (
      <Box 
        style={{
          padding: "8px",
          borderRadius: "8px",
        }}
      >
        test
      </Box>
    );
  };
  


  return (
    <>
      <Calendar 
        locale={currentLocale}
        fullscreen
        cellRender={cellRender}
        onSelect={() => setShowDetails((prev) => !prev)}
      />
      {showDetails && <Box>test</Box>}
    </>
  )
}