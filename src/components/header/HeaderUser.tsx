import React from "react";
import { t } from "i18next";

import { Header, RequestPhone } from "components";
import { useAppContext } from "hooks";
import { Avatar, Spinner, Text } from "zmp-ui";

export function HeaderUser() {
  const { doLogin, logedIn } = useAppContext();
  const { userName, avatar, loading } = useHeaderUser();

  const [ requestPhone, setRequestPhone ] = React.useState<boolean>(false);

  const login = () => {
    if (!logedIn) {
      setRequestPhone(true);
    } else {
      doLogin();
    }
  }

  const renderLogo = () => {
    if (loading) {
      return (
        <div 
          className="circle bg-white center flex-v" 
          style={{ width: 40, height: 40 }}
        >
          <Spinner visible/>
        </div>
      )
    } else {
      return (
        <Avatar src={avatar} size={40}/>
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

      <RequestPhone
        visible={requestPhone}
        closeSheet={() => setRequestPhone(false)}
        onSuccessRequest={() => doLogin()}
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