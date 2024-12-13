import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Stack, Text } from "zmp-ui";

import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { logedInState } from "states";

import { AppLogo, RequestPhone, SizedBox } from "components";

interface App {
  key: string;
  label: string;
  requirePhone: boolean;
}
export function UIHomeAppList() {

  const apps: App[] = [
    { key: "family-tree", label: t("family_tree"), requirePhone: true },
    { key: "album", label: t("album"), requirePhone: true },
    { key: "calendar", label: t("calendar"), requirePhone: true },
    { key: "blogs", label: t("blogs"), requirePhone: true },
    { key: "funds", label: t("funds"), requirePhone: true },
    { key: "certificate", label: t("certificates"), requirePhone: true },
    { key: "theme", label: t("theme"), requirePhone: false },
    { key: "dev", label: t("developer"), requirePhone: false }
  ];

  const navigate = useNavigate();
  const logedIn = useRecoilValue(logedInState);
  const [ requestPhone, setRequestPhone ] = React.useState(false); 

  const handleUserSelectApp = (appKey: string, requirePhone: boolean) => {
    if (requirePhone && !logedIn) {
      setRequestPhone(true);
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
      <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("utilities")} </Text.Title>
      <Grid columnCount={4} rowSpace="0.5rem">
        {renderApps()}
      </Grid>
      <RequestPhone visible={requestPhone} closeSheet={() => setRequestPhone(false)}/>
    </Stack>
  )
}

function AppButton(props: { appKey: string; label: string; onClick: () => void }) {
  const { appKey, label, onClick } = props;
  
  return (
    <div onClick={onClick} className="button">
      <Stack className="center">
        <SizedBox width={60} height={60} borderRadius={10} border>
          <AppSymbol key={`ico-${appKey}`} iconKey={appKey}/> 
        </SizedBox>
        <Text
          key={`title-${appKey}`} 
          size="small" 
          className="mt-2 text-shadow text-capitalize text-center"
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
      return <img key={`ico-${iconKey}`} src={AppLogo.FamilyTree} alt="family tree"/>
    case "album":
      return <img key={`ico-${iconKey}`} src={AppLogo.Album} alt="album"/>
    case "calendar":
      return <img key={`ico-${iconKey}`} src={AppLogo.Calendar} alt="calendar"/>
    case "blogs":
      return <img key={`ico-${iconKey}`} src={AppLogo.Blogs} alt="blogs"/>
    case "funds":
      return <img key={`ico-${iconKey}`} src={AppLogo.Funds} alt="funds"/>
    case "theme":
      return <img key={`ico-${iconKey}`} src={AppLogo.Theme} alt="theme"/>
    case "certificate":
      return <img key={`ico-${iconKey}`} src={AppLogo.Certificate} alt="theme"/>
    case "upcoming":
      return <AppLogo.Upcoming key={`ico-${iconKey}`} size={"3rem"}/>
    case "dev":
      return <AppLogo.CommandLine key={`ico-${iconKey}`} size={"3rem"}/>
    default: 
      return <AppLogo.Approval key={`ico-${iconKey}`} size={"3rem"}/>
  }
}