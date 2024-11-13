import React from 'react';

import { Stack } from 'zmp-ui';
import { t } from 'i18next';

import UIHomeBanner from './UIHomeBanner';
import UIHomeAppList from './UIHomeAppList';
import UIHeader from 'components/common/UIHeader';
import UIHeaderUser from 'components/login/UIHeaderUser';

export function UILayout() {

  return (
    <div className='container'>
      <UIHeader showBackIcon={false} customRender={
        <React.Suspense fallback={t("loading")}>
          <UIHeaderUser/>
        </React.Suspense>
      }/>

      <Stack space='1rem'>
        <UIHomeBanner/>
        <UIHomeAppList/>
      </Stack>
    </div>
  )
};