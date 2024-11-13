import React from 'react';

import { Stack } from 'zmp-ui';
import { t } from 'i18next';

import UIHeader from 'components/common/UIHeader';

import { UIHomeSlider } from './UIHomeSlider';
import { UIAppList } from './UIAppList';
import { UIHeaderUser } from 'components/login/UIHeaderUser';

export function UILayout() {

  return (
    <div className='container'>
      <UIHeader showBackIcon={false} customRender={
        <React.Suspense fallback={t("loading")}>
          <UIHeaderUser/>
        </React.Suspense>
      }/>

      <Stack space='1rem'>
        <UIHomeSlider/>
        <UIAppList/>
      </Stack>
    </div>
  )
};