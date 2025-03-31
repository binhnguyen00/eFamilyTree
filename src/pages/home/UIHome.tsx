import React from 'react';
import { t } from 'i18next';

import { StyleUtils } from 'utils';
import { HeaderUser, Divider, ScrollableDiv, CommonIcon } from 'components';

import { UIHomeBanner } from './UIHomeBanner';
import { UIHomeAppList } from './UIHomeAppList';
import { UIHomeSocialPost } from './UIHomeSocialPost';
import { useAccountContext, useRequestPhoneContext, useRouteNavigate } from 'hooks';
import { Button, Text } from 'zmp-ui';
import { UIThemeList } from 'pages/theme/UITheme';

export function UIHome() {
  return (
    <>
      <HeaderUser/>

      <ScrollableDiv className='container flex-v' direction="vertical" style={{ height: StyleUtils.calComponentRemainingHeight(10) }}>
        <p className="text-capitalize text-center text-shadow pt-3 bold" style={{ fontSize: "2rem" }}>
          {t("gia phả lạc hồng")}
        </p>

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