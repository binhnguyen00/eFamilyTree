import React from "react";
import { t } from "i18next";

import { Grid } from "zmp-ui";

import { Header, useTheme } from "components";

export default function UITheme() {
  return (
    <div className="container">
      <Header title={t("theme")}/>

      <UIThemeSelector/>
    </div>
  )
}

function UIThemeSelector() {
  const { toggleTheme } = useTheme();

  return (
    <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
      TODO
    </Grid>
  )
}