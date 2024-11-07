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

export function UIHomePage() {
  // keys should be same as Route in ../main.tsx
  const funcKeyMap = {
    "about": t("about"),
    "family-tree": t("family_tree"),
    "album": t("album"),
    "calendar": t("calendar"),
    "blogs": t("blogs"),
    "funds": t("funds"),
    "upcoming": t("upcoming"),
    "developer": t("developer"),
  }

  const navigate = useNavigate();

  const navigatePage = (pageKey: string) => {
    navigate(`/${pageKey}`);
  };

  const renderFunctions = () => {
    let html = [] as React.ReactNode[];
    Object.keys(funcKeyMap).forEach(key => {
      const label = funcKeyMap[key] as string;
      html.push(
        <Stack space="0.5rem" key={`stack-${key}`}>

          <Button 
            key={`btn-${key}`} variant="secondary" className="box-shadow" 
            style={{ 
              height: 120, 
              borderRadius: 30, 
            }} 
            onClick={() => navigatePage(key)}
          >
            {renderIcon(key)}
          </Button>

          <Text.Title key={`title-${key}`} size="small" style={{ textAlign: "center", textTransform: "capitalize" }}>
            {label}
          </Text.Title>
          
        </Stack>
      )
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
      return <FcAbout key={`ico-${iconKey}`} size={"3rem"}/>
    case "family-tree":
      return <FcGenealogy key={`ico-${iconKey}`} size={"3rem"}/>
    case "album":
      return <FcStackOfPhotos key={`ico-${iconKey}`} size={"3rem"}/>
    case "calendar":
      return <FcCalendar key={`ico-${iconKey}`} size={"3rem"}/>
    case "blogs":
      return <FcTemplate key={`ico-${iconKey}`} size={"3rem"}/>
    case "funds":
      return <FcMoneyTransfer key={`ico-${iconKey}`} size={"3rem"}/>
    case "upcoming":
      return <FcPlanner key={`ico-${iconKey}`} size={"3rem"}/>
    case "developer":
      return <FcCommandLine key={`ico-${iconKey}`} size={"3rem"}/>
    default: 
      return <FcApproval key={`ico-${iconKey}`} size={"3rem"}/>
  }
}