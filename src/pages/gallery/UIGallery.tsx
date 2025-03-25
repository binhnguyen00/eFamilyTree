import React from "react";
import { t } from "i18next";

import { UIGalleryAlbums } from "./UIGalleryAlbums";

import { Header, ScrollableDiv } from "components";
import { StyleUtils } from "utils";

export function UIGallery() {
  return (
    <>
      <Header title={t("gallery")}/>
      
      <div className="container bg-white text-base">
        <UIGalleryContainer/>
      </div>
    </>
  )
}

function UIGalleryContainer() {
  return (
    <div className="flex-v">
      <ScrollableDiv className="bg-white" direction="vertical" height={StyleUtils.calComponentRemainingHeight(0)}>
        <UIGalleryAlbums/>
      </ScrollableDiv>
    </div>
  )
}