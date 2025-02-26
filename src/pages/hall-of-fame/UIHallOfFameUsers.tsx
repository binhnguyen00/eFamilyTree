import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { HallOfFameApi } from "api";
import { useRouteNavigate, useAppContext } from "hooks";
import { Header, CommonIcon, Loading, Info, ScrollableDiv } from "components";

import { ServerResponse } from "types/server";
import { HallOfFameUser, UIHallOfFameUserDetails } from "./UIHallOfFameUser";
import { StyleUtils } from "utils";
import { UICreateHallOfFame } from "./UICreateHallOfFameUser";

export function UIHallOfFameUsers() {
  const { belongings } = useRouteNavigate();
  const { hallOfFameId, hallOfFameName } = belongings || { hallOfFameId: 0, hallOfFameName: "" };
  const { data, error, loading, refresh } = useHallOfFameUsers(hallOfFameId);

  const [ selectId, setSelectId ] = React.useState<number | null>(null);
  const [ create, setCreate ] = React.useState<boolean>(false);

  const renderUsers = () => {
    let lines: React.ReactNode[] = data.map((hallOfFame: HallOfFameUser, index: number) => {
      return (
        <div
          key={`user-${index}`}
          className="bg-primary text-secondary flex-h justify-between p-3 rounded button"
          onClick={() => setSelectId(hallOfFame.id)}
        >
          <div className="flex-v">
            <Text.Title size="large"> {hallOfFame.memberName} </Text.Title>
            <Text size="small"> {hallOfFame.name} </Text>
          </div>
          <CommonIcon.ChevonRight size={20}/>
        </div>
      )
    })
    return lines as React.ReactNode[];
  }

  const Container = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Info title={t("chưa có dữ liệu")}/>
    } else if (!data.length) {
      return <Info title={t("chưa có dữ liệu")}/>
    } else {
      return renderUsers();
    }
  }

  const Footer = () => {
    return (
      <div style={{ position: "absolute", bottom: 120, right: 10 }}>
        <Button size="small" prefixIcon={<CommonIcon.Plus />} onClick={() => setCreate(true)}>
          {t("thêm")}
        </Button>
      </div>
    )
  }

  return (
    <>
      <Header title={hallOfFameName}/>

      <div className="container bg-white">
        <ScrollableDiv
          className="flex-v"
          direction="vertical"
          height={StyleUtils.calComponentRemainingHeight(44)}
        >
          <Container/>
        </ScrollableDiv>

        <Footer/>
      </div>

      <UIHallOfFameUserDetails
        userId={selectId}
        visible={selectId !== null ? true : false}
        onClose={() => setSelectId(null)}
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
          console.error(result.message);
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