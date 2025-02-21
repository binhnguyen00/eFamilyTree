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
  const [albumsRefreshKey, setAlbumsRefreshKey] = React.useState(0);
  const [imagesRefreshKey, setImagesRefreshKey] = React.useState(0);

  const onTabSelect = (key: string) => {
    if (key === "albums") {
      setAlbumsRefreshKey((prevKey) => prevKey + 1);
    } else if (key === "images") {
      setImagesRefreshKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <Tabs defaultActiveKey="albums" onTabClick={onTabSelect}>
      <Tabs.Tab key="albums" label={<p className="text-capitalize"> {t("album")} </p>}>
        <ScrollableDiv className="bg-white" direction="vertical" height={StyleUtils.calComponentRemainingHeight(44)}>
          <UIGalleryAlbums key={albumsRefreshKey} />
        </ScrollableDiv>
      </Tabs.Tab>

      <Tabs.Tab key="images" label={<p className="text-capitalize"> {t("image_list")} </p>}>
        <ScrollableDiv className="bg-white" direction="vertical" height={StyleUtils.calComponentRemainingHeight(44)}>
          <UIGalleryImages key={imagesRefreshKey} />
        </ScrollableDiv>
      </Tabs.Tab>
    </Tabs>
  );
}
