import React from "react";
import { Grid, Stack, Text, useNavigate } from "zmp-ui";

import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { logedInState } from "states";

import AppIcons from "components/icon/app";
import UIRequestPhone from "components/common/UIRequestPhone";

interface App {
  key: string;
  label: string;
  requirePhone: boolean;
}
export default function UIHomeAppList() {

  const apps: App[] = [
    { key: "family-tree", label: t("family_tree"), requirePhone: true },
    { key: "album", label: t("album"), requirePhone: true },
    { key: "calendar", label: t("calendar"), requirePhone: true },
    { key: "blogs", label: t("blogs"), requirePhone: true },
    { key: "funds", label: t("funds"), requirePhone: true },
    { key: "upcoming", label: t("upcoming"), requirePhone: false },
    { key: "about", label: t("about"), requirePhone: false },
    { key: "developer", label: t("developer"), requirePhone: false }
  ];

  const navigate = useNavigate();
  const logedIn = useRecoilValue(logedInState);
  const [ sheetVisible, setSheetVisible ] = React.useState(false); 

  const handleUserSelectApp = (appKey: string, requirePhone: boolean) => {
    if (requirePhone && !logedIn) {
      setSheetVisible(true);
    } else {
      navigate(`/${appKey}`)
      return;
    }
  }

  const renderApps = () => {
    let html = [] as React.ReactNode[];
    apps.map((app, index) => {
      html.push(
        <AppButton 
          key={app.key} 
          appKey={app.key} 
          label={app.label} 
          onClick={() => handleUserSelectApp(app.key, app.requirePhone)}
        />
      )
    })
    return html;
  }

  return (
    <Stack space="0.5rem">
      <Text.Title className="text-capitalize text-primary"> {t("utilities")} </Text.Title>
      <Grid columnCount={4} rowSpace="0.5rem">
        {renderApps()}
      </Grid>
      <UIRequestPhone visible={sheetVisible} closeSheet={() => setSheetVisible(false)}/>
    </Stack>
  )
}

function AppButton(props: { appKey: string; label: string; onClick: () => void }) {
  const { appKey, label, onClick } = props;
  
  return (
    <div onClick={onClick} className="button">
      <Stack space="0.5rem" className="center">
        <AppSymbol key={`ico-${appKey}`} iconKey={appKey}/> 
        <Text
          key={`title-${appKey}`} 
          size="small" 
          className="mt-2"
          style={{ textTransform: "capitalize", textAlign: "center" }}
        >
          {label}
        </Text>
      </Stack>
    </div>
  )
}

function AppSymbol({ iconKey }: { iconKey: string }) {
  switch (iconKey) {
    case "family-tree":
      return <AppIcons.FamilyTree key={`ico-${iconKey}`} size={"3rem"}/>
    case "album":
      return <AppIcons.Album key={`ico-${iconKey}`} size={"3rem"}/>
    case "calendar":
      return <AppIcons.Calendar key={`ico-${iconKey}`} size={"3rem"}/>
    case "blogs":
      return <AppIcons.Blogs key={`ico-${iconKey}`} size={"3rem"}/>
    case "funds":
      return <AppIcons.Funds key={`ico-${iconKey}`} size={"3rem"}/>
    case "upcoming":
      return <AppIcons.Upcoming key={`ico-${iconKey}`} size={"3rem"}/>
    case "about":
      return <AppIcons.Info key={`ico-${iconKey}`} size={"3rem"}/>
    case "developer":
      return <AppIcons.CommandLine key={`ico-${iconKey}`} size={"3rem"}/>
    default: 
      return <AppIcons.Approval key={`ico-${iconKey}`} size={"3rem"}/>
  }
}