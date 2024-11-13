import React from 'react';

import { Stack } from 'zmp-ui';
import { t } from 'i18next';

import { CommonComponentUtils } from 'components/common/CommonComponentUtils';

import UIHeader from 'components/common/UIHeader';
import UIHeaderUser from 'components/login/UIHeaderUser';
import UIHomeBanner from './UIHomeBanner';
import UIHomeAppList from './UIHomeAppList';
import UIHomeAlbum from './UIHomeAlbum';
import UIHomeBlog from './UIHomeBlog';

export function UILayout() {

  return (
    <div className='container'>
      <UIHeader showBackIcon={false} customRender={
        <React.Suspense fallback={t("loading")}>
          <UIHeaderUser/>
        </React.Suspense>
      }/>

      <Stack space='1rem'>
        <React.Suspense fallback={
          CommonComponentUtils.renderLoading(t("loading"))
        }>
          <UIHomeBanner/>
        </React.Suspense>
        <React.Suspense fallback={
          CommonComponentUtils.renderLoading(t("loading"))
        }>
          <UIHomeAppList/>
        </React.Suspense>
        <React.Suspense fallback={
          CommonComponentUtils.renderLoading(t("loading"))
        }>
          <UIHomeAlbum/>
        </React.Suspense>
        <React.Suspense fallback={
          CommonComponentUtils.renderLoading(t("loading"))
        }>
          <UIHomeBlog/>
        </React.Suspense>
      </Stack>
    </div>
  )
};