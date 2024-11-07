import React from "react";
import DOMPurify from "dompurify";
import { t } from "i18next";
import { useLocation } from 'react-router-dom';
import { Stack, Text } from "zmp-ui";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";

export function UIBlogDetail() {
  const location = useLocation();
  const { blog } = location.state || {
    title: "",
    content: "",
  };
  
  const purifiedContent = DOMPurify.sanitize(blog["content"]);
  
  const addDomainToImageSrc = (html: string) => {
    return html.replace(/<img\s+([^>]*?)src="([^"]*?)"/g, (match, attrs, src) => {
      // Ensure the src doesn't already have a domain due to Odoo
      const newSrc = src.startsWith("http") ? src : `${EFamilyTreeApi.getServerBaseUrl()}${src}`;
      return `<img ${attrs}src="${newSrc}"`;
    });
  };

  const updatedContent = addDomainToImageSrc(purifiedContent);

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("detail_blog"))}

      <Stack space="1rem">
        <Text.Title size="xLarge"> {blog["title"]} </Text.Title>
        <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
      </Stack>
    </div>
  )
}