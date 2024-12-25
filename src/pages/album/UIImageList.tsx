import React from "react";
import { t } from "i18next";

import { Grid, ImageViewer } from "zmp-ui";

import { Header, Info } from "components";
import { useRouteNavigate } from "hooks";

export function UIImageList() { 
  const { belongings } = useRouteNavigate();
  const [ visible, setVisible ] = React.useState(false);
  const [ activeIndex, setActiveIndex ] = React.useState(0);

  const { images } = belongings || [] as any[];

  const renderImages = () => {
    let html = [] as React.ReactNode[];
    if (!images.length) return html;
    else {
      images.map((imageUrl, index) => {
        html.push(
          <div 
            key={index}
            style={{
              borderRadius: "8px",
              overflow: "hidden"
            }}
            className="button"
          >
            <img 
              src={`https://${imageUrl}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} className="button"
              role='presentation'
              onClick={() => {
                setActiveIndex(index);
                setVisible(true);
              }}
            />
          </div>
        )
      })
    }

    const remap: any[] = images.map((imageUrl, index) => {
      return {
        key: index,
        src: `https://${imageUrl}`
      }
    })

    return (
      <>
        {html}
        <ImageViewer 
          images={remap}
          visible={visible}
          activeIndex={activeIndex}
          onClose={() => setVisible(false)}
        />
      </>
    );
  }

  return (
    <div className="container bg-white" style={{ height: "100vh" }}>
      <Header title={t("image_list")} subtitle={images.length}/>

      {images.length ? (
        <Grid columnCount={4} rowSpace="0.5rem" columnSpace="0.5rem">
          {renderImages()}
        </Grid>
      ) : (
        <Info title={t("no_image")}/>
      )}
    </div>
  )
}