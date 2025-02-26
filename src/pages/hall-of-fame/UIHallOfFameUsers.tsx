import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { HallOfFameApi } from "api";
import { useRouteNavigate, useAppContext } from "hooks";
import { Header, CommonIcon, Loading, Info, ScrollableDiv } from "components";

import { ServerResponse } from "types/server";
import { HallOfFameUser, UIHallOfFameUserDetails } from "./UIHallOfFameUser";
import { StyleUtils } from "utils";

export function UIHallOfFameUsers() {
  const { belongings } = useRouteNavigate();
  const { hallOfFameId, hallOfFameName } = belongings || { hallOfFameId: 0, hallOfFameName: "" };
  const { data, error, loading, refresh } = useHallOfFameUsers(hallOfFameId);

  const [ selectId, setSelectId ] = React.useState<number | null>(null);

  const renderUsers = () => {
    let lines: React.ReactNode[] = data.map((hallOfFame: HallOfFameUser, index: number) => {
      return (
        <div
          key={`user-${index}`}
          className="bg-primary text-secondary flex-h justify-between p-3 rounded button"
          onClick={() => setSelectId(hallOfFame.id)}
        >
          <div className="flex-v">
            <Text.Title size="large"> {hallOfFame.member} </Text.Title>
            <Text size="small"> {hallOfFame.name} </Text>
          </div>
          <CommonIcon.ChevonRight size={20}/>
        </div>
      )
    })
    return (
      <ScrollableDiv
        className="flex-v"
        direction="vertical"
        height={StyleUtils.calComponentRemainingHeight(44)}
      >
        {lines}
      </ScrollableDiv>
    )
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
      <div style={{ position: "absolute", bottom: 50, right: 10 }}>
        <Button prefixIcon={<CommonIcon.Plus />} onClick={onCreate}>
          {t("thêm")}
        </Button>
      </div>
    )
  }

  const onCreate = () => {

  }

  return (
    <>
      <Header title={hallOfFameName}/>

      <div className="container max-h bg-white">
        <Container/>

        {/* <Footer/> */}
      </div>

      <UIHallOfFameUserDetails
        userId={selectId}
        visible={selectId !== null ? true : false}
        onClose={() => setSelectId(null)}
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

    HallOfFameApi.getHallOfFameUsers({
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
              id:       data.id,
              name:     data.name,
              member:   data.member,
              ranking:  data.ranking
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