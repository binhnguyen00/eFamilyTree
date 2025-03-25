import React from 'react';
import { t } from 'i18next';
import { Text } from 'zmp-ui';

import { StyleUtils } from 'utils';
import { HeaderUser, Divider, ScrollableDiv } from 'components';

import { UIHomeTheme } from './UIHomeTheme';
import { UIHomeBanner } from './UIHomeBanner';
import { UIHomeAppList } from './UIHomeAppList';
import { UIHomeSocialPost } from './UIHomeSocialPost';

export function UIHome() {
  return (
    <>
      <HeaderUser/>

      <ScrollableDiv className='container flex-v' direction="vertical" style={{ height: StyleUtils.calComponentRemainingHeight(10) }}>
        <p className="text-capitalize text-center text-shadow mt-3 bold" style={{ fontSize: "2rem" }}>
          {t("gia phả lạc hồng")}
        </p>

        <UIHomeAppList/>

        <UIHomeBanner/>

        <Divider/>

        <UIHomeTheme/>

        <Divider/>

        <UIHomeSocialPost/>
        
        <br />
      </ScrollableDiv>
    </>
  )
};