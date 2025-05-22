import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { SolarDate } from "@nghiavuive/lunar_date_vi";
import { Button, DatePicker, Grid, Input, Modal, Sheet, Text } from "zmp-ui";

import { CalendarApi } from "api";
import { DateTimeUtils } from "utils";
import { PageContextProps, PageMode, ServerResponse } from "types";
import { CommonIcon, Info, Label, Loading, Retry, Selection, TailSpin } from "components";
import { useAppContext, useBeanObserver, useFamilyTree, useNotification } from "hooks";

const events: any[] = [
  {
    "id": 1,
    "name": "Got a Date",
    "fromDate": "17/05/2025",
    "toDate": "17/05/2025"
  },
  {
    "id": 2,
    "name": "Got a Date",
    "fromDate": "18/05/2025",
    "toDate": "25/05/2025"
  },
  {
    "id": 3,
    "name": "Got a Date",
    "fromDate": "19/05/2025",
    "toDate": "19/05/2025"
  },
  {
    "id": 4,
    "name": "Got a Date",
    "fromDate": "20/05/2025",
    "toDate": "21/05/2025"
  },
  {
    "id": 5,
    "name": "Got a Date",
    "fromDate": "21/05/2025",
    "toDate": "30/05/2025"
  },
];

function initiate(): Event {
  return {
    id        : 0,
    name      : "",
    note      : "",
    pic       : "",
    picId     : 0,
    fromDate  : "",
    toDate    : "",
    place     : "",
    address   : "",
  }
}
export interface Event {
  id: number;
  name: string;
  note: string;
  pic: string;
  picId: number;
  fromDate: string; // Format: "DD/MM/YYYY"
  toDate: string; // Format: "DD/MM/YYYY"
  place: string;
  address: string;
}

function convert(raws: any[]): Event[] {
  if (!raws.length) return [];
  return raws.map(raw => ({
    id        : raw.id,
    name      : raw.name,
    note      : raw.note,
    pic       : raw.pic,
    picId     : raw.pic_id,
    fromDate  : raw.from_date,
    toDate    : raw.to_date,
    place     : raw.place,
    address   : raw.address,
  } as Event))
}

function useSearchUpcomingEvents(date: Date) {
  const { userInfo }                      = useAppContext();
  const [ upcomming, setUpcomming ]       = React.useState<Event[]>([]);
  const [ loadingUpcomming, setLoading ]  = React.useState(true);
  const [ errorUpcomming, setError ]      = React.useState(false);
  const [ reloadUpcomming, setReload ]    = React.useState(false);

  const refreshUpcomming = () => setReload(!reloadUpcomming);
  const formated = DateTimeUtils.formatToDate(date); // DD/MM/YYYY

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    CalendarApi.searchUpcomingEvents({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      date: formated,
      successCB: (response: ServerResponse) => {
        setLoading(false);
        if (response.status === "success") {
          const events: Event[] = convert(response.data);
          setUpcomming(events);
        } else {
          setError(true);
          setUpcomming([]);
        }
      },
      failCB: () => {
        setLoading(false);
        setError(true);
        setUpcomming([]);
      }
    })
  }, [ reloadUpcomming, date ])

  return { upcomming, loadingUpcomming, errorUpcomming, refreshUpcomming }
}

function useSearchEvents(date: Date) {
  const { userInfo }             = useAppContext();
  const [ events, setEvents ]    = React.useState<Event[]>([]);
  const [ loading, setLoading ]  = React.useState(true);
  const [ error, setError ]      = React.useState(false);
  const [ reload, setReload ]   = React.useState(false);

  const refresh = () => setReload(!reload);
  const formated = DateTimeUtils.formatToDate(date); // DD/MM/YYYY

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    CalendarApi.searchEventsByDate({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      date: formated,
      successCB: (response: ServerResponse) => {
        setLoading(false);
        if (response.status === "success") {
          const events: Event[] = convert(response.data);
          setEvents(events);
        } else {
          setError(true);
          setEvents([]);
        }
      },
      failCB: () => {
        setLoading(false);
        setError(true);
        setEvents([]);
      }
    })
  }, [ reload, date ])

  return { events, loading, error, refresh }
}

interface UIEventsProps extends PageContextProps {
  date: Date;
  className?: string;
  onLoading: (loading: boolean) => void;
}
export function UIEvents(props: UIEventsProps) {
  const { userInfo } = useAppContext();
  const { date, permissions, className, onLoading } = props;
  const { events, loading, error, refresh } = useSearchEvents(date);
  const { upcomming, loadingUpcomming, errorUpcomming } = useSearchUpcomingEvents(date);
  const { activeMembers = [] } = useFamilyTree().useGetActiveMembers(userInfo.id, userInfo.clanId);
  
  const [ event, setEvent ] = React.useState<Event | null>(null);
  const [ viewMode, setViewMode ] = React.useState<PageMode>(PageMode.LIST);

  React.useEffect(() => {
    onLoading(loading);
  }, [ loading, onLoading ]);

  const EventItem = React.memo(({ event, type, className }: { event: Event, type: "event" | "upcomming", className?: string }) => (
    <div key={event.id} onClick={() => {
      setEvent(event)
      setViewMode(PageMode.EDIT)
    }} className={classNames("flex-h", className)}>
      {/* Colored vertical bar at the start */}
      <div className={classNames("w-1 rounded-full", type === "event" ? "bg-blue-500" : "bg-yellow-500")}/>
      <div className="flex-1">
        <Text.Title size="normal" className="button">{event.name}</Text.Title>
        <div className="text-gray-500">
          {`${event.fromDate} - ${event.toDate}`}
        </div>
      </div>
    </div>
  ));

  return (
    <div className={classNames("min-h-[100vh]", className)}>
      <div className="flex-v">
        {loading ? (
          <div className="flex-v">
            <Text.Title size="xLarge" className="text-blue-500">{t("Sự kiện hôm nay")}</Text.Title>
            <TailSpin height={20}/>
          </div>
        ) : error ? (
          <div className="flex-v">
            <Text.Title size="xLarge" className="text-blue-500">{t("Sự kiện hôm nay")}</Text.Title>
            <Text>{t("Không có sự kiện")}</Text>
          </div>
        ) : (
          <div className="flex-v">
            <Text.Title size="xLarge" className="text-blue-500">{t("Sự kiện hôm nay")}</Text.Title>
            <Grid columnCount={1} rowSpace="1rem">
              {events.map(event => <EventItem event={event} type="event" className="button"/>)}
            </Grid>
          </div>
        )}

        {loadingUpcomming ? (
          <div className="flex-v">
            <Text.Title size="xLarge" className="text-orange-500">{t("Sự kiện sắp tới")}</Text.Title>
            <TailSpin height={20}/>
          </div>
        ) : errorUpcomming ? (
          <div className="flex-v">
            <Text.Title size="xLarge" className="text-orange-500">{t("Sự kiện sắp tới")}</Text.Title>
            <Text>{t("Không có sự kiện sắp tới")}</Text>
          </div>
        ) : (
          <div className="flex-v">
            <Text.Title size="xLarge" className="text-orange-500">{t("Sự kiện sắp tới")}</Text.Title>
            <Grid columnCount={1} rowSpace="0.5rem">
              {upcomming.map(event => <EventItem event={event} type="upcomming" className="button"/>)}
            </Grid>
          </div>
        )}
      </div>

      <Sheet title={t("Sự kiện")} visible={PageMode.EDIT === viewMode} onClose={() => setViewMode(PageMode.LIST)} height={"70vh"}>
        <UIEvent 
          mode={PageMode.EDIT} data={event} activeMembers={activeMembers} date={date}
          onClose={() => setEvent(null)} onReloadParent={refresh} permissions={permissions}
        />
      </Sheet>

      <Sheet title={t("Tạo sự kiện")} visible={PageMode.CREATE === viewMode} onClose={() => setViewMode(PageMode.LIST)} height={"70vh"}>
        <UIEvent
          mode={PageMode.CREATE} data={initiate()} activeMembers={activeMembers} date={date}
          onClose={() => setEvent(null)} onReloadParent={refresh} permissions={permissions}
        />
      </Sheet>


      <div className={classNames("flex-h absolute bottom-5 right-5", !permissions.canModerate && "hide")}>
        <Button size="small" prefixIcon={<CommonIcon.AddEvent size={"1rem"}/>} onClick={() => setViewMode(PageMode.CREATE)}>
          {t("tạo")}
        </Button>
      </div>
    </div>
  )
}

interface UIEventProps extends PageContextProps {
  mode: PageMode;
  activeMembers: {
    value: number;
    label: string;
  }[];
  data: Event | null;
  date: Date;
  onClose: () => void;
  onReloadParent?: () => void;
}
function UIEvent(props: UIEventProps) {
  if (!props.data) return;

  const observer = useBeanObserver(props.data)
  const { userInfo } = useAppContext();
  const { successToast, dangerToast, loadingToast } = useNotification();
  const { activeMembers, onClose, onReloadParent, mode, permissions, date } = props;

  const [ warning, setWarning ] = React.useState(false);

  const onCreate = () => {
    const invalidData = (
      !observer.getBean().fromDate || 
      !observer.getBean().toDate || 
      !observer.getBean().name
    )
    if (invalidData) {
      dangerToast(t("Hãy nhập đủ dữ liệu"));
      return;
    }

    CalendarApi.createEvent({
      userId : userInfo.id,
      clanId : userInfo.clanId,
      event  : observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          successToast(t("Lưu Thành Công"))
        } else {
          dangerToast(t("Lưu Thất Bại"))
        }
        if (onReloadParent) onReloadParent();
        onClose();
      },
      fail: () => {
        dangerToast(t("Lưu Thất Bại"))
        if (onReloadParent) onReloadParent();
        onClose()
      }
    })
  }

  const onSave = () => {
    const invalidData = (
      !observer.getBean().fromDate || 
      !observer.getBean().toDate || 
      !observer.getBean().name
    )
    if (invalidData) {
      dangerToast(t("Hãy nhập đủ dữ liệu"));
      return;
    } 

    CalendarApi.saveEvent({
      userId : userInfo.id,
      clanId : userInfo.clanId,
      event  : observer.getBean(),
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          successToast(t("Lưu Thành Công"))
        } else {
          dangerToast(t("Lưu Thất Bại"))
        }
        if (onReloadParent) onReloadParent();
        onClose();
      },
      fail: () => {
        dangerToast(t("Lưu Thất Bại"))
        if (onReloadParent) onReloadParent();
        onClose()
      }
    })
  }

  const onDelete = () => {
    loadingToast({
      content: `${t("delete")} ${observer.getBean().name}...`,
      operation: (successToast, failToast) => {
        CalendarApi.deleteEvent({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          id: observer.getBean().id,
          success: (result: ServerResponse) => {
            if (result.status === "success") {
              successToast(t("xoá thành công"))
            } else {
              failToast(t("xoá thất bại"))
            }
            if (onReloadParent) onReloadParent();
            onClose();
          },
          fail: () => {
            failToast(t("xoá thất bại"))
            if (onReloadParent) onReloadParent();
            onClose()
          }
        })
      }
    })
  }

  const getLunarLabel = (date: Date): string => {
    const calendarDate = DateTimeUtils.toCalendarDate(date);
    const solar = new SolarDate(calendarDate);
    const lunar = solar.toLunarDate();
    return `Ngày ${lunar.getDayName()}, Tháng ${lunar.getMonthName()}, Năm ${lunar.getYearName()}`;
  }

  return (
    <div className="flex-v bg-white text-base p-3 scroll-h">
      <Text size="large" className="text-center text-primary">
        {getLunarLabel(date)}
      </Text>
      <Input
        name="name" label={<Label text={`${t("Tên Sự Kiện")} *`}/>}
        value={observer.getBean().name} onChange={observer.watch} disabled={!permissions.canModerate}
      />
      <Input.TextArea
        name="place" label={<Label text={t("Địa Điểm")}/>}
        value={observer.getBean().place} size="medium"
        onChange={(e) => observer.update("place", e.target.value)} disabled={!permissions.canModerate}
      />
      <Selection
        label={t("Người Phụ Trách")} field={"picId"} placeHolder={t("Chọn người phụ trách")}
        options={activeMembers} observer={observer} isSearchable isDisabled={!permissions.canModerate}
        defaultValue={{ 
          value: observer.getBean().picId ? observer.getBean().picId : "", 
          label: `${observer.getBean().pic ? observer.getBean().pic : ""}`
        }}
      />
      <div className="flex-h">
        <DatePicker
          label={`${t("Từ Ngày")} *`} title={t("Từ Ngày")} disabled={!permissions.canModerate}
          value={DateTimeUtils.toDate(observer.getBean().fromDate)}
          onChange={(value: Date, calendarDate: any) => {
            const date = DateTimeUtils.formatToDate(value);
            observer.update("fromDate", date)
          }}
        />
        <DatePicker
          label={`${t("Đến Ngày")}`} title={t("Đến Ngày")} disabled={!permissions.canModerate}
          value={DateTimeUtils.toDate(observer.getBean().toDate)}
          onChange={(value: Date, calendarDate: any) => {
            const date = DateTimeUtils.formatToDate(value);
            observer.update("toDate", date)
          }} 
        />
      </div>
      <Input.TextArea
        value={observer.getBean().note} disabled={!permissions.canModerate}
        size="medium" name="note" label={<Label text={t("Ghi Chú")}/>}
        onChange={(e) => observer.update("note", e.target.value)}
      />

      <div className={classNames("flex-h", !permissions.canModerate && "hide")}>
        <Button size="small" prefixIcon={<CommonIcon.AddEvent/>} onClick={onCreate} className={classNames(mode.includes(PageMode.CREATE) && "hide")}>
          {t("create")}
        </Button>
        <Button size="small" prefixIcon={<CommonIcon.Save/>} onClick={onSave} className={classNames(mode.includes(PageMode.EDIT) && "hide")}>
          {t("save")}
        </Button>
        <Button size="small" prefixIcon={<CommonIcon.Trash/>} onClick={() => setWarning(true)} className={classNames(mode.includes(PageMode.EDIT) && "hide")}>
          {t("delete")}
        </Button>
      </div>

      <Modal
        visible={warning}
        title={t("Xoá Sự Kiện")}
        description={t("Hành động không thể thu hồi. Bạn có chắc muốn xoá sự kiện này?")}
        onClose={() => setWarning(false)}
        actions={[
          {
            text: t("Xoá"),
            onClick: onDelete
          },
          {
            text: t("Đóng"),
            close: true,
          },
        ]}
      />
    </div>
  )
}