import React from "react";
import { useLocation } from 'react-router-dom';
import { Page } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponent";

export function UIBlogDetail() {
  const location = useLocation();
  const { content } = location.state || {};

  return (
    <Page>
      {CommonComponentUtils.renderHeader("Blog Detail")}

      <div className="container">
        {content}
      </div>
    </Page>
  )
}