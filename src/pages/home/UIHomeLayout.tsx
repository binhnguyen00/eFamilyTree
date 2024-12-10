import React from 'react';

import { Stack } from 'zmp-ui';
import { t } from 'i18next';

import { Header, HeaderUser, Divider, Loading } from 'components';

import { UIHomeBanner } from './UIHomeBanner';
import { UIHomeAppList } from './UIHomeAppList';
import { UIHomeAlbum } from './UIHomeAlbum';
import { UIHomeBlog } from './UIHomeBlog';
import { UIHomeTheme } from './UIHomeTheme';

export function UIHomeLayout() {

  return (
    <div className='container text-base'>
      <Header showBackIcon={false} customRender={
        <React.Suspense fallback={t("loading")}>
          <HeaderUser/>
        </React.Suspense>
      }/>

      <Stack space='1.2rem'>
        <UIHomeBanner/>

        <Divider/>

        <UIHomeAppList/>

        <Divider/>

        <UIHomeTheme/>

        <Divider/>

        <React.Suspense fallback={<Loading message={t("loading")}/>}>
          <UIHomeAlbum/>
        </React.Suspense>

        <Divider/>

        <React.Suspense fallback={<Loading message={t("loading")}/>}>
          <UIHomeBlog/>
        </React.Suspense>

        <Divider/>

      </Stack>
    </div>
  )
};