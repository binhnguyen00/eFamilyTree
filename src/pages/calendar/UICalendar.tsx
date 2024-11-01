import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { PhoneNumberContext } from "../../pages/main";

export function UICalendar() {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language; // vi / en
  const phoneNumber = React.useContext(PhoneNumberContext);

  // states
  const [ data, setData ] = React.useState<any[]>([]);
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

  const renderCalendar = () => {
    if (loading) {
      return CommonComponentUtils.renderLoading();
    } else if (fetchError) {
      return CommonComponentUtils.renderError("server_error", () => setReload((prev) => !prev));
    } else {
      if (data.length > 0) {
        return (
          <Calendar 
            locale={currentLocale}
            fullscreen
          />
        )
      } else return CommonComponentUtils.renderError("no_calendar", () => setReload((prev) => !prev));
    }
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("calendar"))}

      {renderCalendar()}
    </div>
  )
}