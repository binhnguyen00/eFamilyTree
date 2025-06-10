import React from "react";
import { t } from "i18next";
import { DivUtils } from "utils";
import { Header, ScrollableDiv } from "components";

import { UIAlbums } from "./UIAlbums";
import { usePageContext } from "hooks";


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
  const { permissions } = usePageContext();

  return (
    <div className="flex-v">
      <ScrollableDiv className="bg-white" direction="vertical" height={DivUtils.calculateHeight(0)}>
        <UIAlbums permissions={permissions}/>
      </ScrollableDiv>
    </div>
  )
}