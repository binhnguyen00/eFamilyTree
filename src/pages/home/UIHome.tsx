import React from 'react';

import { HeaderUser, Divider, Loading, ScrollableDiv } from 'components';

import { UIHomeBanner } from './UIHomeBanner';
import { UIHomeAppList } from './UIHomeAppList';
import { UIHomeSocialPost } from './UIHomeSocialPost';
import { UIHomeTheme } from './UIHomeTheme';
import { StyleUtils } from 'utils';

export function UIHome() {
  return (
    <>
      <HeaderUser/>

      <ScrollableDiv className='container flex-v' direction="vertical" style={{ height: StyleUtils.calComponentRemainingHeight(10) }}>
        <UIHomeBanner/>

        <Divider/>

        <UIHomeAppList/>

        <Divider/>

        <UIHomeTheme/>

        <Divider/>

        <UIHomeSocialPost/>
        
        <br />
      </ScrollableDiv>
    </>
  )
};