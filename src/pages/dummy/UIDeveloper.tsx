import React from "react";
import { t } from "i18next";
import { Button, Grid, Stack, Text } from "zmp-ui";
import { 
  FcApproval, FcBiotech, FcCalendar, 
  FcGenealogy, FcMoneyTransfer, 
  FcStackOfPhotos, FcTemplate 
} from "react-icons/fc";

import { Header } from "components";
import { useRouteNavigate } from "hooks";

export function UIDeveloper() {
  // keys should be same as Route in ../main.tsx
  const funcKeyMap = {
    "dev/playground": t("playground"),
    "dev/album": t("album"),
    "dev/funds": t("demo_funds"),
    "dev/tree": t("demo_tree"),
    "dev/calendar": t("demo_calendar"),
    "dev/blogs": t("demo_blogs"),
  }
  const { jumpTo } = useRouteNavigate();

  const navigatePage = (pageKey: string) => {
    jumpTo(`${pageKey}`);
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
    </div>
  )
}

function renderIcon(iconKey: string) { 
  switch (iconKey) {
    case "dev/playground":
      return <FcBiotech size={"4.5rem"}/>
    case "dev/tree":
      return <FcGenealogy size={"4.5rem"}/>
    case "dev/funds":
      return <FcMoneyTransfer size={"4.5rem"}/>
    case "dev/calendar":
      return <FcCalendar size={"4.5rem"}/>
    case "dev/blogs":
      return <FcTemplate size={"4.5rem"}/>
    case "dev/album":
      return <FcStackOfPhotos size={"4.5rem"}/>
    default: 
      return <FcApproval size={"4.5rem"}/>
  }
}
