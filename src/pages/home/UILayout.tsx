import React from 'react';

import { t } from 'i18next';

import { Box, Button, Stack, Swiper } from 'zmp-ui';

import UIHeader from 'components/common/UIHeader';
import { UIHomeSlider } from './UIHomeSlider';
import { UIAppList } from './UIAppList';

export function UILayout() {

  return (
    <div className='container'>
      <UIHeader showBackIcon={false}
        customRender={
          <Button style={{ margin: 0 }} size='small'> Đăng Nhập </Button>
        }
      />

      <Stack space='1rem'>

        <UIHomeSlider/>
        <UIAppList/>

      </Stack>
    </div>
  )
};