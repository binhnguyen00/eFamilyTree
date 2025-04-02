import React from "react";
import { t } from "i18next";
import { Grid, Text } from "zmp-ui";

import { AppLogo, SizedBox } from "components";
import { useRouteNavigate, useAccountContext, useRequestPhoneContext } from "hooks";

type App = {
  key: string;
  label: string;
}

export function UIHomeAppList() {
  const apps: App[] = [
    { key: "family-tree",       label: t("family_tree"),       },
    { key: "gallery",           label: t("gallery"),           },
    { key: "calendar",          label: t("calendar"),          },
    { key: "ritual-script",     label: t("ritual_script"),     },
    { key: "memorial-location", label: t("memorial_location"), },
    { key: "social-posts",      label: t("blogs"),             },
    { key: "funds",             label: t("funds"),             },
    { key: "hall-of-fame",      label: t("certificates"),      }, 
  ];

  return (
    <div className="bg-secondary rounded p-3 box-shadow-primary">
      <Grid columnCount={4} rowSpace="0.5rem">
        <AppList apps={apps}/>
      </Grid>
    </div>
  )
}

function AppList({ apps }: { apps: App[] }) {
  const { goTo } = useRouteNavigate();
  const { 
    needRegisterClan, registerClan, 
    needRegisterAccount, registerAccount } = useAccountContext();
  const { needPhone, requestPhone } = useRequestPhoneContext();

  const onSelectApp = (appKey: string) => {
    if (needPhone) { requestPhone(); return; }
    else if (needRegisterClan) { registerClan(); return; } 
    else if (needRegisterAccount) { registerAccount(); return; }
    else goTo({ path: appKey })
  }

  const renderApps = () => {
    const html: React.ReactNode[] = apps.map((app, index) => {
      return (
        <AppButton 
          key={app.key} 
          appKey={app.key} 
          label={app.label} 
          onClick={() => onSelectApp(app.key)}
        />
      )
    })
    return html
  }

  return renderApps();
}

function AppButton(props: { appKey: string; label: string; onClick: () => void }) {
  const { appKey, label, onClick } = props;
  const appSize = 60;
  return (
    <div onClick={onClick} className="button">
      <div className="flex-v center">
        <SizedBox width={appSize} height={appSize} className="circle">
          <AppSymbol key={`ico-${appKey}`} iconKey={appKey}/> 
        </SizedBox>
        <Text
          key={`title-${appKey}`}  
          className="text-primary bold text-capitalize text-center"
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
    case "social-posts":
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