import React from "react";
import { t } from "i18next";
import { Tabs as ZTabs } from "zmp-ui";

import { UIGalleryImages } from './UIGalleryImages';
import { UIGalleryAlbums } from "./UIGalleryAlbums";

import { Header } from "components";

export function UIGallery() {
  return (
    <div className="container-padding text-base">
      <Header title={t("gallery")}/>

      <UIGalleryContainer/>
    </div>
  )
}

function UIGalleryContainer() {
  let [ totalImages, setTotalImages ] = React.useState<number>(0);
  let [ totalAlbums, setTotalAlbums ] = React.useState<number>(0);

  const getImagesQuantity = (quantity: number) => {
    setTotalImages(quantity);
  }

  const getAlbumsQuantity = (quantity: number) => {
    setTotalAlbums(quantity);
  }

  return (
    <ZTabs defaultActiveKey="images">

      <ZTabs.Tab key={"images"} label={<p className="text-capitalize"> {`${totalImages} ${t("image_list")}`} </p>}>
        <UIGalleryImages getQuantity={getImagesQuantity}/>
      </ZTabs.Tab>
      
      <ZTabs.Tab key={"albums"} label={<p className="text-capitalize"> {`${t("albums")}`} </p>}>
        <UIGalleryAlbums getQuantity={getAlbumsQuantity}/>
      </ZTabs.Tab>

    </ZTabs>
  )
}