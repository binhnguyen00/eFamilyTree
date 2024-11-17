import React from "react";
import { t } from "i18next";
import { FcApproval, FcCalendar, FcGenealogy, FcMoneyTransfer, FcTemplate, FcBiotech, FcStackOfPhotos } from "react-icons/fc";

import { Button, Grid, Stack, Text, useNavigate } from "zmp-ui";

import Header from "components/header/Header";

function UIDeveloper() {
  // keys should be same as Route in ../main.tsx
  const funcKeyMap = {
    "playground": t("playground"),
    "demo-album": t("album"),
    "demo-funds": t("demo_funds"),
    "demo-tree": t("demo_tree"),
    "demo-calendar": t("demo_calendar"),
    "demo-blogs": t("demo_blogs"),
  }
  const navigate = useNavigate();

  const navigatePage = (pageKey: string) => {
    navigate(`/${pageKey}`);
  };

  const renderFunctions = () => {
    let html = [] as React.ReactNode[];

    Object.keys(funcKeyMap).forEach(key => {
      const element = (
        <Stack key={`dev-stack-${key}`} space="0.5rem">

          <Button 
            key={`dev-btn-${key}`} variant="tertiary" className="box-shadow" 
            style={{ 
              height: 120, 
              borderRadius: 30, 
            }} 
            onClick={() => navigatePage(key)}
          >
            {renderIcon(key)}
          </Button>

          <Text.Title 
            key={`dev-title-${key}`} 
            style={{ fontWeight: "bold", textAlign: "center", textTransform: "capitalize" }}
          >
            {funcKeyMap[key]}
          </Text.Title>
        </Stack>
      )

      html.push(element);
    });
    
    return html;
  }

  return (
    <div className="container">
      <Header title={t("developer")}/>

      <Grid style={{ padding: "0 1rem" }} columnSpace="1rem" rowSpace="1rem" columnCount={2}>
        {renderFunctions()}
      </Grid>
      <br />

    </div>
  )
}

function renderIcon(iconKey: string) { 
  switch (iconKey) {
    case "playground":
      return <FcBiotech size={"4.5rem"}/>
    case "demo-tree":
      return <FcGenealogy size={"4.5rem"}/>
    case "demo-funds":
      return <FcMoneyTransfer size={"4.5rem"}/>
    case "demo-calendar":
      return <FcCalendar size={"4.5rem"}/>
    case "demo-blogs":
      return <FcTemplate size={"4.5rem"}/>
    case "demo-album":
      return <FcStackOfPhotos size={"4.5rem"}/>
    default: 
      return <FcApproval size={"4.5rem"}/>
  }
}

export default UIDeveloper;