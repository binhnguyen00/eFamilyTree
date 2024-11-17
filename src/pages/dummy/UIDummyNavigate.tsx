import React from "react";
import { useLocation } from "react-router-dom";
import { t } from "i18next";

import { Box } from "zmp-ui";

import UIHeader from "components/common/UIHeader";

export default function UIDummyNavigate() {
  const location = useLocation();
  const { data } = location.state || null;

  return (
    <div className="container">
      <UIHeader title={t("dummy_detail")}/>

      <Box>
        {JSON.stringify(data, null, 2)}
      </Box>
    </div>
  )
}
