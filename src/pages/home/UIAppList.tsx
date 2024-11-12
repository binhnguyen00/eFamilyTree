import React from "react";
import { t } from "i18next";
import { Box, Button, Stack, Text, useNavigate, ZBox } from "zmp-ui";
import { FcApproval, FcCalendar, FcCommandLine, FcGenealogy, FcMoneyTransfer, FcPlanner, FcStackOfPhotos, FcTemplate } from "react-icons/fc";

export function UIAppList() {

  const funcKeyMap = {
    "family-tree": t("family_tree"),
    "album": t("album"),
    "calendar": t("calendar"),
    "blogs": t("blogs"),
    "funds": t("funds"),
    "upcoming": t("upcoming"),
    "developer": t("developer"),
  }

  const renderApps = () => {
    let html = [] as React.ReactNode[];
    Object.keys(funcKeyMap).forEach(key => {
      const label = funcKeyMap[key] as string;
      html.push(<AppButton appKey={key} label={label}/>)
    });

    return html
  }

  return (
    <Stack space="0.5rem">
      <Text.Title> {"Tiện Ích"} </Text.Title>
      <Box flex flexDirection='row' className="scrollable">
        {renderApps()}
      </Box>
    </Stack>
  )
}

function AppButton({appKey, label}: { appKey: string; label: string; }) {
  const navigate = useNavigate();
  const navigatePage = (pageKey: string) => {
    navigate(`/${pageKey}`);
  };

  return (
    <Stack space="1rem">
      <Button key={`app-${appKey}`} variant="tertiary" onClick={() => navigatePage(appKey)}> 
        <AppIcon key={`icon-${appKey}`} iconKey={appKey}/> 
      </Button>
      <Text.Title 
        key={`title-${appKey}`} size="small" 
        style={{ fontWeight: "bold", textTransform: "capitalize", textAlign: "center" }}
      >
        {label}
      </Text.Title>
    </Stack>
  )
}

function AppIcon({ iconKey }: { iconKey: string }) {
  switch (iconKey) {
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