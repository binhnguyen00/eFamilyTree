import React, { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Grid, Button, Stack, Text, Box, Page } from "zmp-ui";
import { closeApp } from "zmp-sdk";

import { UIUser } from "../../pages/user/UIUser";
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIHomePage() {
  const { t } = useTranslation();
  let navigate = useNavigate();

  const navigatePage = (pageKey: string) => {
    navigate(`/${pageKey}`);
    navigate = undefined as any;
  };

  const renderFunctions = () => {
    // keys should be same as Route in ../main.tsx
    const funcKeyMap = {
      "about": t("about"),
      "family-tree": t("family_tree"),
      "album": t("album"),
      "calendar": t("calendar"),
      "blogs": t("blogs"),
      "upcoming": t("upcoming"),
      "playground": t("playground"),
      "demo-tree": t("demo_tree"),
    }
    let html = [] as React.ReactNode[];

    Object.keys(funcKeyMap).forEach(key => {
      const element = (
        <Button 
          key={key} variant="secondary" className="box-shadow" style={{ height: 150, borderRadius: 12 }} 
          onClick={() => navigatePage(key)}
        > 
          {funcKeyMap[key]} 
        </Button>
      )
      html.push(element);
    });

    return html;
  }

  return (
    <Page>
      {CommonComponentUtils.renderHeader("Home", false)}

      <Stack space="1rem" className="container">
        <Suspense fallback={
          <Box flex justifyContent='center'> 
            <Text.Title>{"Getting User's Info..."}</Text.Title> 
          </Box>
        }>
          <UIUser/>
        </Suspense>
        
        <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
          {renderFunctions()}
        </Grid>

        <Button type="danger" variant="secondary" onClick={() => closeApp()}>
          {t("quit")}
        </Button>
      </Stack>
    </Page>
  );
};