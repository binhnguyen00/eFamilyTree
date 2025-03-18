import React from 'react';

import { HeaderUser, Divider, Loading } from 'components';

import { UIHomeBanner } from './UIHomeBanner';
import { UIHomeAppList } from './UIHomeAppList';
import { UIHomeSocialPost } from './UIHomeSocialPost';
import { UIHomeTheme } from './UIHomeTheme';

export function UIHome() {
  return (
    <div className='container text-secondary'>
      <HeaderUser/>

      <div className='flex-v'>
        <React.Suspense fallback={<Loading/>}>
          <UIHomeBanner/>
        </React.Suspense>

        <Divider/>

        <React.Suspense fallback={<Loading/>}>
          <UIHomeAppList/>
        </React.Suspense>

        <Divider/>

        <React.Suspense fallback={<Loading/>}>
          <UIHomeTheme/>
        </React.Suspense>

        <Divider/>

        <React.Suspense fallback={<Loading/>}>
          <UIHomeSocialPost/>
        </React.Suspense>

        <Divider/>
      </div>
    </div>
  )
};