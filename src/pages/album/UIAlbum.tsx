import React from "react";
import { t } from "i18next";
import { phoneState } from "states";
import { useRecoilValue } from "recoil";

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
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ images, setImages ] = React.useState<any[]>([]);

  React.useEffect(() => {
    
    const success = (result: any[] | string) => {
      if (typeof result === 'string') {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setImages(result || []);
      }
    }

    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    }

    EFamilyTreeApi.getMemberAlbum(phoneNumber, success, fail);

  }, [ reload ]);

  if (images.length > 0) {
    return (
      <div>
        
      </div>
    )
  } else {
    if (fetchError) {
      return CommonComponentUtils.renderError(t("server_error"), () => setReload(!reload));
    } else return CommonComponentUtils.renderLoading(t("no_album"));
  }
}