import React from "react";
import { t } from "i18next";

import { Header, TailSpin } from "components";
import { useAppContext, useRequestPhoneContext } from "hooks";
import { Avatar, Text } from "zmp-ui";

export function HeaderUser() {
  const { logedIn } = useAppContext();
  const { requestPhone } = useRequestPhoneContext(); 
  const { userName, avatar, loading } = useHeaderUser();

  const login = () => requestPhone();

  const renderLogo = () => {
    if (loading) {
      return <TailSpin height={40} width={40}/>
    } else {
      return (
        <Avatar src={avatar} size={40} backgroundColor="BLUE-BLUELIGHT"/>
      )
    }
  }

  const onCustomRender = () => {
    if (!logedIn) {
      return (
        <div className="flex-h flex-grow-0">
          {renderLogo()}
          <div>
            <Text.Title size="small" className="text-capitalize text-shadow"> 
              {t("hello")} {userName}
            </Text.Title>
            <p className="button bold" onClick={login}>
              {t("login")}
            </p>
          </div>
        </div>
      )
    } else {
      return (
        <div className="flex-h flex-grow-0">
          {renderLogo()}
          <div>
            <Text.Title size="small" className="text-capitalize text-shadow"> 
              {t("hello")} {userName}
            </Text.Title>
            <Text size="small">
              {t("have_a_great_day")}
            </Text>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <Header
        showBackIcon={false}
        customRender={onCustomRender()}
      />
    </>
  )
}

function useHeaderUser() {
  const { logedIn, zaloUserInfo } = useAppContext();

  const [ userName, setUserName ] = React.useState("");
  const [ avatar, setAvatar ] = React.useState("");
  const [ loading, setLoading ] = React.useState(true);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    if (!logedIn) {
      setUserName(t("người dùng"));
      setAvatar("https://avatar.iran.liara.run/public/47")
      setLoading(false);
    } else {
      if (zaloUserInfo.id) {
        setUserName(zaloUserInfo.name)
        setAvatar(zaloUserInfo.avatar)
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [ logedIn, zaloUserInfo ]);

  return { userName, avatar, loading, refresh }
}