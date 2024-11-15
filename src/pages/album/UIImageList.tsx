import React from "react";
import { useLocation } from "react-router-dom";
import { t } from "i18next";

import { Box, Grid, ImageViewer } from "zmp-ui";

import { UIHeader } from "components/common/UIHeader";
import { openMediaPicker } from "zmp-sdk/apis";
import { FcAddImage } from "react-icons/fc";

function UIImageList() { 
  const location = useLocation();
  const [ visible, setVisible ] = React.useState(false);
  const [ activeIndex, setActiveIndex ] = React.useState(0);

  const { images } = location.state || [] as any[];

  const renderImages = () => {
    let html = [] as React.ReactNode[];

    if (!images) return html;
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
    html.push(renderAddButton());

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

  const renderAddButton = () => {
    const addImage = () => {
      openMediaPicker({
        serverUploadUrl: "",
        type: "photo",
          success: (res) => {
            const { data } = res;
            const result = JSON.parse(data);
            console.log(result);
          },
          fail: (error) => {
            console.log(error);
          },
      })
    }

    return (
      <Box flex justifyContent="center">
        <FcAddImage size={"4.5em"} className="button" onClick={addImage} />
      </Box>
    )
  }

  return (
    <div className="container">
      <UIHeader title={t("image_list")} subtitle={images.length}/>

      <Grid columnCount={3} rowSpace="0.5rem" columnSpace="0.5rem">
        {images.length ? renderImages() : renderAddButton()}
      </Grid>
    </div>
  )
}

export default UIImageList;