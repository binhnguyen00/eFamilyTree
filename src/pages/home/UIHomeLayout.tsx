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
import UIDivider from 'components/common/UIDivider';

export default function UIHomeLayout() {

  return (
    <div className='container'>
      <UIHeader showBackIcon={false} customRender={
        <React.Suspense fallback={t("loading")}>
          <UIHeaderUser/>
        </React.Suspense>
      }/>

      <Stack space='1.2rem'>
        <React.Suspense fallback={
          CommonComponentUtils.renderLoading(t("loading"), 'small')
        }>
          <UIHomeBanner/>
        </React.Suspense>

        <UIDivider/>

        <UIHomeAppList/>

        <UIDivider/>

        <React.Suspense fallback={
          CommonComponentUtils.renderLoading(t("loading"), 'small')
        }>
          <UIHomeAlbum/>
        </React.Suspense>

        <UIDivider/>

        <React.Suspense fallback={
          CommonComponentUtils.renderLoading(t("loading"), 'small')
        }>
          <UIHomeBlog/>
        </React.Suspense>

        <UIDivider/>

      </Stack>
    </div>
  )
};