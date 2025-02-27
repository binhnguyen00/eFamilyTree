import React from "react";
import { t } from "i18next";
import { Grid, Text } from "zmp-ui";

import { useAppContext, useRouteNavigate, useAccountContext } from "hooks";
import { AppLogo, RequestPhone, SizedBox } from "components";

type App = {
  key: string;
  label: string;
  requirePhone: boolean;
}

export function UIHomeAppList() {
  const apps: App[] = [
    { key: "family-tree",       label: t("family_tree"),       requirePhone: true },
    { key: "gallery",           label: t("gallery"),           requirePhone: true },
    { key: "calendar",          label: t("calendar"),          requirePhone: true },
    { key: "ritual-script",     label: t("ritual_script"),     requirePhone: true },
    { key: "memorial-location", label: t("memorial_location"), requirePhone: true },
    { key: "blogs",             label: t("blogs"),             requirePhone: true },
    { key: "funds",             label: t("funds"),             requirePhone: true },
    { key: "hall-of-fame",      label: t("certificates"),      requirePhone: true }, 
  ];

  return (
    <div className="flex-v">
      <Text.Title 
        size="xLarge" 
        className="text-capitalize text-shadow"
      > 
        {t("utilities")} 
      </Text.Title>

      <Grid columnCount={4} rowSpace="0.5rem">
        <AppList apps={apps}/>
      </Grid>
    </div>
  )
}

function AppList({ apps }: { apps: App[] }) {
  const { goTo } = useRouteNavigate();
  const { logedIn } = useAppContext();
  const { needRegisterClan, registerClan, needRegisterAccount, registerAccount } = useAccountContext();
  const [ requestPhone, setRequestPhone ] = React.useState(false); 

  const onSelectApp = (appKey: string, requirePhone: boolean) => {
    if (requirePhone && !logedIn) {
      setRequestPhone(true);
    } else {
      if (needRegisterClan) { registerClan(); return; } 
      if (needRegisterAccount) { registerAccount(); return; }
      goTo({ path: appKey })
    }
  }

  const renderApps = () => {
    const html: React.ReactNode[] = apps.map((app, index) => {
      return (
        <AppButton 
          key={app.key} 
          appKey={app.key} 
          label={app.label} 
          onClick={() => onSelectApp(app.key, app.requirePhone)}
        />
      )
    })
    return html
  }

  return (
    <>
      {renderApps()}

      <RequestPhone 
        visible={requestPhone} 
        closeSheet={() => setRequestPhone(false)}
      />
    </>
  )
}

function AppButton(props: { appKey: string; label: string; onClick: () => void }) {
  const { appKey, label, onClick } = props;
  
  return (
    <div onClick={onClick} className="button">
      <div className="flex-v center">
        <SizedBox width={68} height={68} borderRadius={10} border>
          <AppSymbol key={`ico-${appKey}`} iconKey={appKey}/> 
        </SizedBox>
        <Text
          key={`title-${appKey}`}  
          className="mt-2 text-shadow bold text-capitalize text-center"
        >
          {label}
        </Text>
      </div>
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
    case "hall-of-fame":
      return <img key={`ico-${iconKey}`} src={AppLogo.HallOfFame} alt="hall-of-fame"/>
    case "ritual-script":
      return <img key={`ico-${iconKey}`} src={AppLogo.RitualScript} alt="ritual-script"/>
    default: 
      return <AppLogo.Approval key={`ico-${iconKey}`} size={"3rem"}/>
  }
}