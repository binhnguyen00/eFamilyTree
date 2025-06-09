import React from "react";
import { t } from "i18next";
import { Button, Text, Avatar as ZaloAvatar } from "zmp-ui";

import { HallOfFameApi } from "api";
import { useRouteNavigate, useAppContext } from "hooks";
import { Header, CommonIcon, Loading, Info, ScrollableDiv, Divider } from "components";

import { ServerResponse } from "types/server";
import { HallOfFameUser, UIHallOfFameUserDetails } from "./UIHallOfFameUser";
import { DivUtils } from "utils";
import { UICreateHallOfFame } from "./UICreateHallOfFameUser";

const data = [
  {
    id: 1,
    name: "Nhân Vật Lịch Sử",
    memberName: "Trần Thanh Tường",
  },
]

export function UIHallOfFameUsers() {
  const { belongings } = useRouteNavigate();
  const { hallOfFameId, hallOfFameName } = belongings || { hallOfFameId: 0, hallOfFameName: "" };
  const { data, error, loading, refresh } = useHallOfFameUsers(hallOfFameId);
  const { serverBaseUrl } = useAppContext();

  const [ selectId, setSelectId ] = React.useState<number | null>(null);
  const [ create, setCreate ] = React.useState<boolean>(false);

  const Avatar = React.memo(({ src, placeHolder }: { src: string, placeHolder: string }) => {
    return <ZaloAvatar backgroundColor="BLUE-BLUELIGHT" size={65} src={src === "" ? placeHolder : src}/>
  });

  const users = React.useMemo(() => {
    return data.map((user: HallOfFameUser, index: number) => {

      const parts: string[] = user.memberName.trim().split(/\s+/);
      const firstName: string = parts[0];
      const lastName: string = parts[parts.length - 1];

      const avatar = user.avatar ? `${serverBaseUrl}/${user.avatar}` : "";
      const avatarHolder = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(`${firstName} ${lastName}`)}`;

      return (
        <div key={`user-${index}`}>
          <div className="flex-h">
            <div className="center" style={{ width: "5.5rem" }}>
              <Avatar src={avatar} placeHolder={avatarHolder}/>
            </div>
            <div
              className="flex-v p-3 rounded button"
              style={{ width: "100%" }}
              onClick={() => setSelectId(user.id)}
            >
              <Text.Title className="content-center text-primary"> {user.memberName} </Text.Title>
              <Text className="content-center text-base"> {user.recognitionDate ? user.recognitionDate : ""} </Text>
            </div>
          </div>
          <Divider/>
        </div>
      );
    });
  }, [data]);

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Info title={t("chưa có dữ liệu")}/>
    } else if (!data.length) {
      return <Info title={t("chưa có dữ liệu")}/>
    } else {
      return (
        <ScrollableDiv height={DivUtils.calculateHeight(0)}>
          {users}
          <br/><br/>
        </ScrollableDiv>
      );
    }
  }

  const renderFooter = () => {
    return (
      <div style={{ position: "absolute", bottom: 20, right: 10 }}>
        <Button size="small" prefixIcon={<CommonIcon.AddPerson size={"1.1rem"}/>} onClick={() => setCreate(true)}>
          {t("add")}
        </Button>
      </div>
    )
  }

  return (
    <>
      <Header title={hallOfFameName}/>

      <div className="container bg-white">
        {renderContainer()}

        {renderFooter()}
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

  const [ data, setData ] = React.useState<HallOfFameUser[]>([]);
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setData([])

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
          setData(data);
        }
      },
      fail: () => {
        setError(true);
        setLoading(false);
      }
    });
  }, [ reload, typeId ]);

  return { data, loading, error, refresh };
}