import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { hasPhonePermission, userState } from "states";

import { Header, Loading } from "components";

import UISignInUser from "./UISignInUser";
import UISignedInUser from "./UISignedInUser";

export function UIUser() { 
  const { t } = useTranslation();
  const loginedIn = useRecoilValue(hasPhonePermission);
  const userInfo = useRecoilValue(userState);

  const [ container, setContainer ] = React.useState(<Loading message={t("loading")} />);

  React.useEffect(() => {
    if (loginedIn) {
      setContainer(<UISignedInUser userInfo={userInfo} />);
    } else {
      setContainer(<UISignInUser />);
    }
  }, [ loginedIn, userInfo ]);

  return (
    <div className="container">
      <Header title={t("account")} />
      <React.Suspense>
        {container}
      </React.Suspense>
    </div>
  )
}

