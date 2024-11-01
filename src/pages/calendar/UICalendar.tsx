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
    const success = (result: any) => {
      setLoading(false);
      if (typeof result === 'string') {
        console.log(result);
        setFetchError(true);
      } else {
        setData(result);
      }
    }

    const fail = (error: any) => {
      setLoading(false);
      setFetchError(true);
    } 

    EFamilyTreeApi.getMemberUpcomingEvents(phoneNumber, success, fail);
  }, [reload])

  const renderCalendar = () => {
    if (loading) {
      return CommonComponentUtils.renderLoading();
    } else if (fetchError) {
      const onRetry = () => {
        setReload(!reload);
      };
      return CommonComponentUtils.renderError("server_error", onRetry);
    } else {
      return (
        <Calendar 
          locale={currentLocale}
          fullscreen
        />
      )
    }
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("calendar"))}

      {renderCalendar()}
    </div>
  )
}