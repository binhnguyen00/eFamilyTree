import React, { Suspense } from "react";
import { Page, useNavigate, Grid, Button, Stack, Text } from "zmp-ui";
import { closeApp } from "zmp-sdk";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { UIUser } from "pages/user/UIUser";

export function UIHomePage() {
  let navigate = useNavigate();

  const handleTabChange = (key: string) => {
    navigate("/" + key);
    navigate = undefined as any;
  };

  const renderFunctions = () => {
    // keys should be same as Route in ../main.tsx
    const funcKeyMap = {
      "about": "About",
      "family-tree": "Family Tree",
      "album": "Album",
      "calendar": "Calendar",
      "upcoming": "Upcoming",
      "playground": "Playground",
      "demo-tree": "Dummy Tree",
    }
    let html = [] as React.ReactNode[];

    Object.keys(funcKeyMap).forEach(key => {
      const element = (
        <Button 
          key={key} variant="secondary" className="box-shadow" style={{ height: 150, borderRadius: 12 }} 
          onClick={() => handleTabChange(key)}
        > 
          {funcKeyMap[key]} 
        </Button>
      )
      html.push(element);
    });

    return html;
  }

  return (
    <Page className="page">
      {CommonComponentUtils.renderHeader("Home", false)}

      <Stack space="1rem">
        <Suspense fallback={<div> Getting User's Info </div>}>
          <UIUser/>
        </Suspense>
        
        <Grid columnSpace="1rem" rowSpace="1rem" columnCount={2}>
          {renderFunctions()}
        </Grid>

        <Button type="danger" variant="secondary" onClick={() => closeApp()}>
          {"Quit"}
        </Button>
      </Stack>
    </Page>
  );
};