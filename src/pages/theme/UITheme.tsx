import React from "react";

import { Header } from "components";
import { t } from "i18next";
import { Grid } from "zmp-ui";

export default function UITheme() {
  return (
    <div className="container">
      <Header title={t("theme")}/>

      <UIThemeSelector/>
    </div>
  )
}

function UIThemeSelector() {
  const toggleTheme = (themeCode: string) => {
    document.documentElement.setAttribute("data-theme", themeCode);
  };

  return (
    <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
      <div className="button" onClick={() => toggleTheme("default")}>
        default
      </div>
      <div className="button" onClick={() => toggleTheme("blue")}>
        blue
      </div>
    </Grid>
  )
}