import React from "react";
import i18n from "i18n";
import { t } from "i18next";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { languageState, logedInState, requestPhoneTriesState } from "states";

import { Button, Stack, Switch, useNavigate } from "zmp-ui";

export default function UISignInUser() {
  const navigate = useNavigate();

  const retry = useSetRecoilState(requestPhoneTriesState);
  const login = useRecoilValue(logedInState);
  const currentLanguage = useRecoilValue(languageState);
  const setLanguage = useSetRecoilState(languageState);

  const [viLang, setViLang] = React.useState(currentLanguage === "vi");

  const handleLanguageChange = () => {
    const newLang = viLang ? "en" : "vi";
    setViLang(!viLang);
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };
  
  return (
    <Stack space="1rem">
      {!login && (
        <Button variant="secondary" onClick={() => retry(r => r + 1)}>
          {t("login")}
        </Button>
      )}
      {!login && (
        <Button variant="secondary">
          {t("register")}
        </Button>
      )}
      <Button variant="secondary">
        {t("register_clan")}
      </Button>

      <Button variant="secondary" onClick={() => navigate("/about")}>
        {t("about")}
      </Button>

      {/* TODO: Future
      <Switch 
        label={t("vietnamese")} 
        checked={viLang}
        onChange={handleLanguageChange}
      /> */}

    </Stack>
  )
}