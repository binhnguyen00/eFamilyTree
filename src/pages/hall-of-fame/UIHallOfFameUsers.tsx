import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { HallOfFameApi } from "api";
import { useRouteNavigate, useAppContext } from "hooks";
import { Header, CommonIcon, Loading, Info } from "components";

import { ServerResponse } from "types/server";
import { HallOfFameUser, UIHallOfFameUserDetails } from "./UIHallOfFameUser";

export function UIHallOfFameUsers() {
  const { belongings } = useRouteNavigate();
  const { hallOfFameId, hallOfFameName } = belongings || { hallOfFameId: 0, hallOfFameName: "" };
  const { data, error, loading, refresh } = useHallOfFameUsers(hallOfFameId);

  const [ selectId, setSelectId ] = React.useState<number | null>(null);

  const onSelect = (id: number) => setSelectId(id)

  const renderUsers = () => {
    let lines: React.ReactNode[] = data.map((user: HallOfFameUser, index: number) => {
      return (
        <div
          key={`user-${index}`}
          className="bg-primary text-secondary flex-h justify-between p-3 rounded"
          onSelect={() => onSelect(user.id)}
        >
          <div>
            <Text> {user.name} </Text>
          </div>
          <CommonIcon.ChevonRight size={20}/>
        </div>
      )
    })
    return (
      <div className="flex-v">
        {lines}
      </div>
    )
  }

  const Container = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Info title={t("chưa có dữ liệu")} message={t("hãy thêm người dùng")}/>
    } else if (!data.length) {
      return <Info title={t("chưa có dữ liệu")} message={t("hãy thêm người dùng")}/>
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

      <div className="container bg-white">
        <Container/>

        <Footer/>
      </div>

      <UIHallOfFameUserDetails
        userId={selectId}
        visible={selectId === null ? false : true}
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
          const data = result.data as any[];
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