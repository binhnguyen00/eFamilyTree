import React from "react";
import { t } from "i18next";
import { DivUtils } from "utils";
import { Header, ScrollableDiv } from "components";

import { UIAlbums } from "./UIAlbums";


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
      <ScrollableDiv className="bg-white" direction="vertical" height={DivUtils.calculateHeight(0)}>
        <UIAlbums/>
      </ScrollableDiv>
    </div>
  )
}