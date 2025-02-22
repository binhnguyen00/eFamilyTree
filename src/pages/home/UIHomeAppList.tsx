import React from "react";
import { t } from "i18next";
import { Grid, Stack, Text } from "zmp-ui";

import { useAppContext, useRouteNavigate } from "hooks";
import { AppLogo, RequestPhone, SizedBox } from "components";

type App = {
  key: string;
  label: string;
  requirePhone: boolean;
}

export function UIHomeAppList() {
  const apps: App[] = [
    { key: "family-tree",       label: t("family_tree"),       requirePhone: false },
    { key: "gallery",           label: t("gallery"),           requirePhone: true },
    { key: "calendar",          label: t("calendar"),          requirePhone: true },
    { key: "blogs",             label: t("blogs"),             requirePhone: true },
    { key: "funds",             label: t("funds"),             requirePhone: true },
    { key: "certificate",       label: t("certificates"),      requirePhone: true },
    { key: "ritual-script",     label: t("ritual_script"),     requirePhone: false },
    { key: "memorial-location", label: t("memorial_location"), requirePhone: true },
  ];

  return (
    <Stack space="0.5rem">
      <Text.Title 
        size="xLarge" 
        className="text-capitalize text-shadow"
      > 
        {t("utilities")} 
      </Text.Title>

      <Grid columnCount={4} rowSpace="0.5rem">
        <AppList apps={apps}/>
      </Grid>
    </Stack>
  )
}

function AppList({ apps }: { apps: App[] }) {
  const { goTo } = useRouteNavigate();
  const { logedIn } = useAppContext();
  const [ requestPhone, setRequestPhone ] = React.useState(false); 

  const onSelectApp = (appKey: string, requirePhone: boolean) => {
    if (requirePhone && !logedIn) {
      setRequestPhone(true);
    } else {
      goTo({ path: appKey })
    }
  }

  let html: React.ReactNode[] = [];
  apps.map((app, index) => {
    html.push(
      <AppButton 
        key={app.key} 
        appKey={app.key} 
        label={app.label} 
        onClick={() => onSelectApp(app.key, app.requirePhone)}
      />
    )
  })

  return (
    <React.Fragment>
      {html}
      <RequestPhone 
        visible={requestPhone} 
        closeSheet={() => setRequestPhone(false)}
      />
    </React.Fragment>
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
          className="mt-2 text-shadow bold text-capitalize text-center"
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
    case "gallery":
      return <img key={`ico-${iconKey}`} src={AppLogo.Album} alt="gallery"/>
    case "calendar":
      return <img key={`ico-${iconKey}`} src={AppLogo.Calendar} alt="calendar"/>
    case "blogs":
      return <img key={`ico-${iconKey}`} src={AppLogo.Blogs} alt="blogs"/>
    case "funds":
      return <img key={`ico-${iconKey}`} src={AppLogo.Funds} alt="funds"/>
    case "memorial-location":
      return <img key={`ico-${iconKey}`} src={AppLogo.MemorialLocation} alt="memorial-location"/>
    case "certificate":
      return <img key={`ico-${iconKey}`} src={AppLogo.Certificate} alt="certificate"/>
    case "ritual-script":
      return <img key={`ico-${iconKey}`} src={AppLogo.RitualScript} alt="ritual-script"/>
    default: 
      return <AppLogo.Approval key={`ico-${iconKey}`} size={"3rem"}/>
  }
}