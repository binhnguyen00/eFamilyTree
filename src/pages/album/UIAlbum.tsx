import React from "react";
import { FcAddImage } from "react-icons/fc";
import { t } from "i18next";
import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { Grid } from "zmp-ui";
import { openMediaPicker } from "zmp-sdk/apis";
import { CommonComponentUtils } from "components/common/CommonComponentUtils";
import { FailResponse } from "utils/Interface";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";

export function UIAlbum() {
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("album"))}

      <UIImageList />
    </div>
  )
}

function UIImageList() {

  const phoneNumber = useRecoilValue(phoneState);
  const [ reload, setReload ] = React.useState(false);
  const [ images, setImages ] = React.useState<any[]>([]);

  React.useEffect(() => {

    const success = (result: any[] | string) => {
      // result should be a list of image urls
      if (typeof result === 'string') {
        console.warn(result);
      } else {
        setImages(result || [] as any[]);
      }
    }

    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
    }

    EFamilyTreeApi.getMemberAlbum(phoneNumber, success, fail);

  }, [ reload ]);

  const renderImages = () => {
    if (!images) return;
    let html = [] as React.ReactNode[];
    images.map((image, index) => {
      html.push(
        <div key={index}>
          <img src={image.url} />
        </div>
      )
    })
    html.push(renderAddButton());
    return html;
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
      <div className="button squared">
        <FcAddImage size={"4.5em"} onClick={addImage} />
      </div>
    )
  }

  return (
    <Grid columnCount={4} columnSpace="0.5rem" rowSpace="0.5rem">
      {images.length > 0 ? renderImages() : renderAddButton()}
    </Grid>
  )
}