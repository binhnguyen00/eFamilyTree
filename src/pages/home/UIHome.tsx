import React from 'react';
import { Outlet } from "react-router-dom";

import { Stack } from 'zmp-ui';
import { t } from 'i18next';

import { Header, HeaderUser, Divider, Loading } from 'components';

import { UIHomeBanner } from './UIHomeBanner';
import { UIHomeAppList } from './UIHomeAppList';
import { UIHomeBlog } from './UIHomeBlog';
import { UIHomeTheme } from './UIHomeTheme';

export function UIHome() {
  return (
    <div className='container text-secondary'>
      <Header showBackIcon={false} customRender={
        <React.Suspense fallback={t("loading")}>
          <HeaderUser/>
        </React.Suspense>
      }/>

      <Stack>
        <React.Suspense fallback={<Loading message={t("loading")}/>}>
          <UIHomeBanner/>
        </React.Suspense>

        <Divider/>

        <React.Suspense fallback={<Loading message={t("loading")}/>}>
          <UIHomeAppList/>
        </React.Suspense>

        <Divider/>

        <React.Suspense fallback={<Loading message={t("loading")}/>}>
          <UIHomeTheme/>
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

export function UIHomeLayout() { 
  return (
    <Outlet/>
  )
}