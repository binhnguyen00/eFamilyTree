import React from "react";
import { t } from "i18next";
import { useNavigate, Button, Stack, Text, Box, Grid } from "zmp-ui";

import { UIUser } from "../../pages/user/UIUser";
import { CommonComponentUtils } from "../../utils/CommonComponentUtils";

// icons
import { 
  FcAbout, FcCalendar, FcGenealogy, FcStackOfPhotos,
  FcTemplate, FcMoneyTransfer, FcCommandLine, FcPlanner, FcApproval
} from "react-icons/fc";

// keys should be same as Route in ../main.tsx
const funcKeyMap = {
  "about": t("about"),
  "family-tree": t("family_tree"),
  "album": t("album"),
  "calendar": t("calendar"),
  "blogs": t("blogs"),
  "funds": t("funds"),
  "upcoming": t("upcoming"),
  "playground": t("playground"),

  "demo-funds": t("demo_funds"),
  "demo-tree": t("demo_tree"),
  "demo-calendar": t("demo_calendar"),
  "demo-blogs": t("demo_blogs"),
}

export function UIHomePage() {
  const navigate = useNavigate();

  const navigatePage = (pageKey: string) => {
    navigate(`/${pageKey}`);
  };

  const renderFunctions = () => {

    let html = [] as React.ReactNode[];

    Object.keys(funcKeyMap).forEach(key => {
      const element = (
        <Stack space="0.5rem">

          <Button 
            key={key} variant="secondary" className="box-shadow" 
            style={{ 
              height: 120, 
              borderRadius: 30, 
            }} 
            onClick={() => navigatePage(key)}
          >
            {renderIcon(key)}
          </Button>

          <Text.Title size="small" style={{ textAlign: "center" }}>
            {funcKeyMap[key]}
          </Text.Title>
        </Stack>
      )

      html.push(element);
    });

    return html
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("home").toUpperCase(), t("home_subtitle"), null, false)}

      <Stack space="1rem">
        
        <React.Suspense fallback={
          <Box flex justifyContent='center'> 
            <Text.Title>{t("loading_user_info")}</Text.Title> 
          </Box>
        }>
          <UIUser/>
        </React.Suspense>
        
        <Grid style={{ padding: "0 1rem" }} columnSpace="1rem" rowSpace="1rem" columnCount={2}>
          {renderFunctions()}
        </Grid>

      </Stack>
      <br />

    </div>
  );
};

function renderIcon(iconKey: string) { 
  switch (iconKey) {
    case "about":
      return <FcAbout size={"3rem"}/>
    case "family-tree":
      return <FcGenealogy size={"3rem"}/>
    case "album":
      return <FcStackOfPhotos size={"3rem"}/>
    case "calendar":
      return <FcCalendar size={"3rem"}/>
    case "blogs":
      return <FcTemplate size={"3rem"}/>
    case "funds":
      return <FcMoneyTransfer size={"3rem"}/>
    case "upcoming":
      return <FcPlanner size={"3rem"}/>
    case "playground":
      return <FcCommandLine size={"3rem"}/>
    default: 
      return <FcApproval size={"3rem"}/>
  }
}