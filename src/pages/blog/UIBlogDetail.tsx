import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';
import { Page, Stack, Text } from "zmp-ui";
import DOMPurify from "dompurify";

import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";

export function UIBlogDetail() {
  const { t } = useTranslation();
  const location = useLocation();
  const { blog } = location.state || {};
  console.log(blog);
  
  const purifiedContent = DOMPurify.sanitize(blog["content"]);
  
  const addDomainToImageSrc = (html: string) => {
    return html.replace(/<img\s+([^>]*?)src="([^"]*?)"/g, (match, attrs, src) => {
      // Ensure the src doesn't already have a domain due to Odoo
      const newSrc = src.startsWith("http") ? src : `${EFamilyTreeApi.getServerBaseUrl()}${src}`;
      return `<img ${attrs}src="${newSrc}"`;
    });
  };

  const updatedContent = addDomainToImageSrc(purifiedContent);
  console.log(updatedContent);

  return (
    <Page>
      {CommonComponentUtils.renderHeader(t("detail_blog"))}

      <Stack space="1rem" className="container">
        <Text.Title size="xLarge">
          {blog["title"]}
        </Text.Title>
        <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
      </Stack>
    </Page>
  )
}