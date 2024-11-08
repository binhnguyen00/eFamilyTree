import React from "react";
import { useLocation } from "react-router-dom";
import { t } from "i18next";

import { CommonComponentUtils } from "components/common/CommonComponentUtils";
import { Box } from "zmp-ui";

export function UIDummyNavigate() {
  const location = useLocation();
  const { data } = location.state || null;

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("dummy_detail"))}

      <Box>
        {JSON.stringify(data, null, 2)}
      </Box>
    </div>
  )
}
