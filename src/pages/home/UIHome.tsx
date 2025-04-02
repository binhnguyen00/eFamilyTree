import React from 'react';
import { t } from 'i18next';
import { Button, Text } from 'zmp-ui';

import { StyleUtils } from 'utils';
import { HeaderUser, Divider, ScrollableDiv, CommonIcon } from 'components';
import { useAccountContext, useRequestPhoneContext, useRouteNavigate } from 'hooks';

import { UIHomeBanner } from './UIHomeBanner';
import { UIHomeAppList } from './UIHomeAppList';
import { UIHomeSocialPost } from './UIHomeSocialPost';
import { UIThemeList } from 'pages/theme/UITheme';

export function UIHome() {
  return (
    <>
      <HeaderUser/>

      <ScrollableDiv className='container flex-v' direction="vertical" style={{ height: StyleUtils.calComponentRemainingHeight(10) }}>
        <div/>

        <AppTitle/>

        <UIHomeAppList/>

        <UIHomeBanner/>

        <Divider className='bg-secondary'/>
        <div className='flex-v'>
          <ThemeTitle/>
          <div className="scroll-h">
            <UIThemeList/>
          </div>
        </div>

        <Divider className='bg-secondary'/>
        <div className='flex-v'>
          <SocialPostTitle/>
          <UIHomeSocialPost/>
        </div>
        
        <br />
      </ScrollableDiv>
    </>
  )
};

function AppTitle() {
  return (
    <div className="mt-3 mb-3" style={{ position: 'relative' }}>
      {/* White half-circle element */}
      <div
        style={{
          position: 'absolute',
          top: -250,
          left: '50%',
          transform: 'translateX(-50%)',
          width: "140vw",
          height: 450,
          borderRadius: "0 0 50% 50%",
          backgroundColor: `var(--quaternary-color)`,
          boxShadow: "0 0 30px 5px rgba(255, 255, 255, 0.6)", // Glow effect
          zIndex: -1,
        }}
      />
      <p 
        className="text-capitalize text-primary center bold text-shadow-secondary" 
        style={{ 
          fontSize: "2.4rem", 
          position: 'relative', 
          zIndex: 0,
        }}
      >
        {t("gia phả lạc hồng")}
      </p>
    </div>
  )
}

function ThemeTitle() {
  const { 
    needRegisterClan, registerClan, 
    needRegisterAccount, registerAccount } = useAccountContext();
  const { needPhone, requestPhone } = useRequestPhoneContext();
  const { goTo } = useRouteNavigate();

  const onGoToThemes = () => {
    if (needPhone) { requestPhone(); return; }
    else if (needRegisterClan) { registerClan(); return; } 
    else if (needRegisterAccount) { registerAccount(); return; }
    else goTo({ path: "theme" })
  }

  return (
    <div className="flex-h justify-between">
      <Text.Title size="xLarge" className="text-secondary text-capitalize"> {t("theme")} </Text.Title>
      <div>
        <Button 
          size="small" variant="secondary"
          suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} 
          onClick={onGoToThemes}
        >
          {t("more")}
        </Button>
      </div>
    </div>
  )
}

function SocialPostTitle() {
  const { needRegisterClan, registerClan, needRegisterAccount, registerAccount } = useAccountContext();
  const { needPhone, requestPhone } = useRequestPhoneContext();
  const { goTo } = useRouteNavigate();

  const goToSocialPosts = () => {
    if (needPhone) { requestPhone(); return; }
    else if (needRegisterClan) { registerClan(); return; } 
    else if (needRegisterAccount) { registerAccount(); return; }
    else goTo({ path: "social-posts" });
  }

  return (
      <div className="flex-h justify-between">
      <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("blogs")} </Text.Title>
      <Button 
        size="small" variant="secondary" 
        suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} 
        onClick={goToSocialPosts}
      >
        {t("more")}
      </Button>
    </div>
  )
}