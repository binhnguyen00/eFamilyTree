import React from "react";
import { t } from "i18next";
import { Grid, Tabs } from "zmp-ui";
import { Gallery } from "react-grid-gallery";

import Lightbox from "yet-another-react-lightbox";
import { Zoom, Thumbnails, Counter } from "yet-another-react-lightbox/plugins";

import { StyleUtils } from "utils";
import { Card, Header, ScrollableDiv } from "components";

import images from "./sample/images.json";
import albums from "./sample/albums.json";

export function UIDummyGallery() {
  return (
    <div className="container-padding text-base">
      <Header title={t("gallery")}/>

      <UIGalleryContainer/>
    </div>
  )
}

function UIGalleryContainer() {
  return (
    <Tabs defaultActiveKey="images" destroyInactiveTabPane>

      <Tabs.Tab key={"images"} label={<p> {t("image_list")} </p>}>
        <ScrollableDiv className="bg-white" direction="vertical" height={StyleUtils.calComponentRemainingHeight(44)}>
          <UIGalleryImages/>
        </ScrollableDiv>
      </Tabs.Tab>
      
      <Tabs.Tab key={"albums"} label={<p> {t("albums")} </p>}>
        <ScrollableDiv direction="vertical" height={StyleUtils.calComponentRemainingHeight(44)}>
          <UIGalleryAlbums/>
        </ScrollableDiv>
      </Tabs.Tab>

    </Tabs>
  )
}

// ================================
// IMAGES
// ================================
function UIGalleryImages() {
  const [ index, setIndex ] = React.useState(-1);
  
  const select = (index: number, item: any) => { setIndex(index); }
  const close = () => setIndex(-1);

  const slides = images.map((imgPath: string, index) => {
    return {
      src: `${imgPath}`,
      width: 320,
      height: 240,
      imageFit: "cover",
    }
  }) as any[]

  return (
    <div>
      <Gallery 
        images={slides}
        onClick={select}
        enableImageSelection={false}
      />
      <Lightbox
        slides={slides}
        open={index >= 0}
        index={index}
        close={close}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 50,
        }}
        plugins={[Zoom, Thumbnails, Counter]}
      />
    </div>
  )
}

// ================================
// ALBUMS
// ================================
function UIGalleryAlbums() {
  const [ show, setShow ] = React.useState(false);
  const [ name, setName ] = React.useState<string>("");

  const close = () => { setShow(false) }
  const open = (name: string) => { 
    setShow(true) 
    setName(name)
  }

  const renderAlbums = () => {
    const html = albums.map((album, index) => {
      return (
        <Card
          key={`album-${index}`}
          onClick={() => open(album.name)}
          src={album.thumbnail}
          height={"auto"}
          title={album.name}
          className="button bg-secondary text-primary"
        />  
      )
    })
    return (
      <Grid className="p-2" columnCount={2} rowSpace="0.5rem" columnSpace="0.5rem">
        {html}
      </Grid>
    )
  }

  return (
    <>
      <div>
        {renderAlbums()}
      </div>
    </>
  )
}