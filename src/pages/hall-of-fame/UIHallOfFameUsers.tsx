import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { Button, Text, Avatar as ZaloAvatar } from "zmp-ui";

import { DivUtils } from "utils";
import { HallOfFameApi } from "api";
import { ServerResponse } from "types";
import { useRouteNavigate, useAppContext, usePageContext } from "hooks";
import { Header, CommonIcon, Loading, Info, ScrollableDiv, Divider, MarginToolbar, Toolbar, Retry } from "components";

import { UICreateHallOfFame } from "./UICreateHallOfFameUser";
import { HallOfFameUser, UIHallOfFameUserDetails } from "./UIHallOfFameUser";

const users = [
  {
    id: 1,
    name: "Nhân Vật Lịch Sử",
    memberName: "Trần Thanh Tường",
  },
]

export function UIHallOfFameUsers() {
  const { belongings } = useRouteNavigate();
  const { hallOfFameId, hallOfFameName } = belongings || { hallOfFameId: 0, hallOfFameName: "" };
  const { users, error, loading, refresh } = useHallOfFameUsers(hallOfFameId);
  const { serverBaseUrl } = useAppContext();
  const { permissions } = usePageContext();

  const [ selectId, setSelectId ] = React.useState<number | null>(null);
  const [ create, setCreate ] = React.useState<boolean>(false);

  const Avatar = React.memo(({ src, placeHolder }: { src: string, placeHolder: string }) => {
    return <ZaloAvatar backgroundColor="BLUE-BLUELIGHT" size={65} src={src === "" ? placeHolder : src}/>
  });

  const userList = React.useMemo(() => {
    return users.map((user: HallOfFameUser, index: number) => {

      const parts: string[] = user.memberName.trim().split(/\s+/);
      const firstName: string = parts[0];
      const lastName: string = parts[parts.length - 1];

      const avatar = user.avatar ? `${serverBaseUrl}/${user.avatar}` : "";
      const avatarHolder = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(`${firstName} ${lastName}`)}`;
      const glass = "bg-gradient-to-br backdrop-blur-xl from-white/50 to-white/10 dark:from-black/5 dark:to-black/1"

      return (
        <div key={`user-${index}`} className={classNames(glass, "rounded", "p-3", "button")}>
          <div className="flex-h">
            <div className="center" style={{ width: "5.5rem" }}>
              <Avatar src={avatar} placeHolder={avatarHolder}/>
            </div>
            <div className="flex-v" style={{ width: "100%" }} onClick={() => setSelectId(user.id)}>
              <Text.Title className="content-center text-primary"> {user.memberName} </Text.Title>
              <Text className="content-center text-base"> {user.recognitionDate ? user.recognitionDate : ""} </Text>
            </div>
          </div>
          <Divider/>
        </div>
      );
    });
  }, [users]);

  const renderToolbar = () => {
    if (!permissions.canModerate) {
      return null;
    }
    return (
      <>
        <MarginToolbar/>
        <Toolbar>
          <Button size="small" prefixIcon={<CommonIcon.AddPerson size={"1.1rem"}/>} onClick={() => setCreate(true)}>
            {t("add")}
          </Button>
        </Toolbar>
      </>
    )
  }

  const renderContainer = () => {
    if (loading) {
      return (
        <>
          <Loading/>
          {renderToolbar()}
        </>
      )
    } else if (error) {
      return <Retry title={t("Chưa có dữ liệu")} onClick={() => refresh()} extra={renderToolbar()}/>
    } else if (!users.length) {
      return (
        <>
          <Info title={t("Chưa có dữ liệu")}/>
          {renderToolbar()}
        </>
      )
    } else {
      return (
        <ScrollableDiv height={DivUtils.calculateHeight(0)} className="flex-v">
          {userList}
          <br/><br/>
        </ScrollableDiv>
      );
    }
  }

  return (
    <>
      <Header title={hallOfFameName}/>

      <div className="container bg-white">
        {renderContainer()}
      </div>

      <UIHallOfFameUserDetails
        userId={selectId}
        hallOfFameTypeId={hallOfFameId}
        visible={selectId !== null ? true : false}
        onClose={() => setSelectId(null)}
        onReloadParent={() => refresh()}
      />

      <UICreateHallOfFame
        visible={create}
        hallOfFameTypeId={hallOfFameId}
        onClose={() => setCreate(false)}
        onReloadParent={() => refresh()}
      />
    </>
  )
}

function useHallOfFameUsers(typeId: number) {
  const { userInfo } = useAppContext();

  const [ users, setUsers ] = React.useState<HallOfFameUser[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setUsers([])

    HallOfFameApi.searchMembers({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      typeId: typeId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "error") {
          setError(true);
        } else {
          const resultData = result.data as any[];
          const data: HallOfFameUser[] = resultData.map((data: any) => {
            return {
              id:               data["id"],
              name:             data["name"],
              avatar:           data["avatar"],  
              memberId:         data["member_id"],
              memberName:       data["member_name"],
              typeId:           data["type_id"],
              typeName:         data["type_name"],
              ranking:          data["ranking"],
              recognitionDate:  data["recognition_date"],
              achievement:      data["achievement"]
            }
          })
          setUsers(data);
        }
      },
      fail: () => {
        setError(true);
        setLoading(false);
      }
    });
  }, [ reload, typeId ]);

  return { users, loading, error, refresh };
}