import React from "react";
import { t } from "i18next";
import { Tabs } from "zmp-ui";

import { UIGalleryImages } from './UIGalleryImages';
import { UIGalleryAlbums } from "./UIGalleryAlbums";

import { Header, ScrollableDiv } from "components";
import { StyleUtils } from "utils";

export function UIGallery() {
  return (
    <>
      <Header title={t("gallery")}/>
      
      <div className="container-padding text-base">
        <UIGalleryContainer/>
      </div>
    </>
  )
}

function UIGalleryContainer() {
  let [ totalImages, setTotalImages ] = React.useState<number>(0);

  const getImagesQuantity = (quantity: number) => {
    setTotalImages(quantity);
  }

  return (
    <Tabs defaultActiveKey="albums">

      <Tabs.Tab key={"albums"} label={<p className="text-capitalize"> {`${t("album")}`} </p>}>
        <ScrollableDiv className="bg-white" direction="vertical" height={StyleUtils.calComponentRemainingHeight(44)}>
          <UIGalleryAlbums/>
        </ScrollableDiv>
      </Tabs.Tab>
      
      <Tabs.Tab key={"images"} label={<p className="text-capitalize"> {`${totalImages} ${t("image_list")}`} </p>}>
        <ScrollableDiv className="bg-white" direction="vertical" height={StyleUtils.calComponentRemainingHeight(44)}>
          <UIGalleryImages getQuantity={getImagesQuantity}/>
        </ScrollableDiv>
      </Tabs.Tab>

    </Tabs>
  )
}