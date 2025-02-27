import React from "react";
import { t } from "i18next";
import { Button, Sheet } from "zmp-ui";

import { CommonIcon, Divider } from "components";
import { useAppContext, useRouteNavigate } from "hooks";

export type AccountCtx = {
  needRegisterClan: boolean,
  needRegisterAccount: boolean,
  registerClan: () => void,
  registerAccount: () => void,
}

export const AccountContext = React.createContext({} as AccountCtx);
export function useAccountContext() { return React.useContext(AccountContext) }

/**
 * @description Check if Zalo user exists in database and Request for register clan and account if not.
 */
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { logedIn, userInfo } = useAppContext();

  const [ needRegisterClan, setNeedRegisterClan ]               = React.useState<boolean>(false);
  const [ needRegisterAccount, setNeedRegisterAccount ]         = React.useState<boolean>(false);
  const [ clanRegistrationHandled, setClanRegistrationHandled ] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (logedIn) {
      if (userInfo.clanId === 0) {
        setNeedRegisterClan(true);
      } else {
        setClanRegistrationHandled(true);
      }
    }
  }, [ logedIn, userInfo ]);

  React.useEffect(() => {
    if (clanRegistrationHandled && userInfo.id === 0) {
      setNeedRegisterAccount(true);
    }
  }, [ clanRegistrationHandled, userInfo ]);

  const requestRegisterClan = () => {
    if (logedIn && !needRegisterClan) {
      setNeedRegisterClan(true);
      return;
    }
  }

  const requestRegisterAccount = () => {
    if (logedIn && !needRegisterAccount) {
      setNeedRegisterAccount(true);
      return;
    }
  }

  const context = {
    needRegisterClan: needRegisterClan,
    needRegisterAccount: needRegisterAccount,
    registerClan: () => requestRegisterClan(),
    registerAccount: () => requestRegisterAccount,
  } as any;

  return (
    <AccountContext.Provider value={context}>
      {children}

      <RequestRegisterAccount
        visible={needRegisterAccount}
        onClose={() => setNeedRegisterAccount(false)}
      />

      <RequestRegisterClan
        visible={needRegisterClan}
        onClose={() => setNeedRegisterClan(false)}
      />
    </AccountContext.Provider>
  )
}

interface RequestRegisterProps {
  visible: boolean;
  onClose: () => void;
}
function RequestRegisterClan(props: RequestRegisterProps) {
  const { visible, onClose } = props;
  const { goTo } = useRouteNavigate();

  const onDecline = () => onClose()
  const onAccept = () => {
    onClose();
    goTo({ path: "register/clan" })
  }

  return (
    <Sheet 
      title={t("đăng ký dòng họ")}
      visible={visible}
      onClose={onClose}
      mask maskClosable
    >
      <div className="flex-v p-3 text-wrap">

        <div className="flex-h">
          <CommonIcon.RegisterClan size={20}/>
          <p> {t("Bạn chưa đăng ký dòng họ")} </p>
        </div>

        <p> {t("Chúng tôi ghi nhận bạn chưa thuộc dòng họ nào trong hệ thống")} </p>
        <p> {t("Để có thể trải nghiệm các dịch vụ mà chúng tôi cung cấp, vui lòng đồng ý đăng ký dòng họ")} </p>

        <Divider size={0}/>

        <div className="flex-v">
          <Button size="medium" onClick={onAccept}>
            {t("allow")}
          </Button>
          <Button size="medium" variant="tertiary" onClick={onDecline}>
            {t("decline")}
          </Button>
        </div>

      </div>
    </Sheet>
  )
}

function RequestRegisterAccount(props: RequestRegisterProps) {
  const { visible, onClose } = props;
  const { goTo } = useRouteNavigate();

  const onDecline = () => onClose()
  const onAccept = () => {
    onClose();
    goTo({ path: "register/account" })
  }

  return (
    <Sheet 
      title={t("đăng ký tài khoản")}
      visible={visible}
      onClose={onClose}
      mask maskClosable
    >
      <div className="flex-v p-3 text-wrap">

        <div className="flex-h">
          <CommonIcon.AddPerson size={20}/>
          <p> {t("Bạn chưa đăng ký tài khoản")} </p>
        </div>

        <p> {t("Chúng tôi ghi nhận bạn chưa có tài khoản trong hệ thống")} </p>
        <p> {t("Để có thể trải nghiệm các dịch vụ mà chúng tôi cung cấp, vui lòng đồng ý đăng ký tài khoản")} </p>

        <Divider size={0}/>

        <div className="flex-v">
          <Button size="medium" onClick={onAccept}>
            {t("allow")}
          </Button>
          <Button size="medium" variant="tertiary" onClick={onDecline}>
            {t("decline")}
          </Button>
        </div>

      </div>
    </Sheet>
  )
}