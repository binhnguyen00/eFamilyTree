import React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { logedInState, userState } from "states";

import { CommonComponentUtils } from "components/common/CommonComponentUtils";
import { UIHeader } from "components/common/UIHeader";

import UISignInUser from "./UISignInUser";
import UISignedInUser from "./UISignedInUser";

export default function UIUser() { 
  const { t } = useTranslation();
  const loginedIn = useRecoilValue(logedInState);
  const userInfo = useRecoilValue(userState);

  const [ container, setContainer ] = React.useState(CommonComponentUtils.renderLoading(t("loading")));

  React.useEffect(() => {
    if (loginedIn) {
      setContainer(<UISignedInUser userInfo={userInfo} />);
    } else {
      setContainer(<UISignInUser />);
    }
  }, [ loginedIn, userInfo ]);

  return (
    <div className="container">
      <UIHeader title={t("account")} />
      <React.Suspense>
        {container}
      </React.Suspense>
    </div>
  )
}

