import React from "react";
import { t } from "i18next";
import { Button, Grid, Stack, Text, useNavigate } from "zmp-ui";
import { CommonComponentUtils } from "utils/CommonComponentUtils";
import { FcApproval, FcCalendar, FcGenealogy, FcMoneyTransfer, FcTemplate, FcBiotech } from "react-icons/fc";


export function UIDeveloper() {
  // keys should be same as Route in ../main.tsx
  const funcKeyMap = {
    "playground": t("playground"),
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
      {CommonComponentUtils.renderHeader(t("developer"))}

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
      return <FcBiotech size={"3rem"}/>
    case "demo-tree":
      return <FcGenealogy size={"3rem"}/>
    case "demo-funds":
      return <FcMoneyTransfer size={"3rem"}/>
    case "demo-calendar":
      return <FcCalendar size={"3rem"}/>
    case "demo-blogs":
      return <FcTemplate size={"3rem"}/>
    default: 
      return <FcApproval size={"3rem"}/>
  }
}