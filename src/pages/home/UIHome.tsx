import React, { Suspense } from "react";
import { Page, useNavigate, Grid, Button, Stack, Text, Box } from "zmp-ui";
import { closeApp } from "zmp-sdk";

import { UIUser } from "../../pages/user/UIUser";
import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIHomePage() {
  let navigate = useNavigate();

  const navigatePage = (pageKey: string) => {
    navigate(`/${pageKey}`);
    navigate = undefined as any;
  };

  const renderFunctions = () => {
    // keys should be same as Route in ../main.tsx
    const funcKeyMap = {
      "about": "About",
      "family-tree": "Family Tree",
      "album": "Album",
      "calendar": "Calendar",
      "blog": "Blog",
      "upcoming": "Upcoming",
      "playground": "Playground",
      "demo-tree": "Dummy Tree",
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
    <div className="container" style={{ marginTop: 44 }}>
      {CommonComponentUtils.renderHeader("Home", false)}

      <Stack space="1rem">
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
          {"Quit"}
        </Button>
      </Stack>
    </div>
  );
};