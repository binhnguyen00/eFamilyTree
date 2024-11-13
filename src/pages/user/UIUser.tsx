import React from "react";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { logedInState, phoneState, userState } from "states";

import { useNavigate } from "zmp-ui";

import UIHeader from "components/common/UIHeader";
import UISignInUser from "./UISignInUser";
import UISignedInUser from "./UISignedInUser";

export default function UIUser() { 
  const navigate = useNavigate();
  const loginedIn = useRecoilValue(logedInState);
  const userInfo = useRecoilValue(userState);

  return (
    <div className="container">
      <UIHeader title={t("account")} showBackIcon={false}/>

      {loginedIn ? (
        <UISignedInUser userInfo={userInfo} />
      ) : (
        <UISignInUser/>
      )}
    </div>
  )
}

