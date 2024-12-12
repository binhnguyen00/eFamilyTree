import React from "react";
import { t } from "i18next";
import { useLocation } from 'react-router-dom';

import DOMPurify from "dompurify";
import { Stack, Text } from "zmp-ui";

import { EFamilyTreeApi } from "utils";
import { Header } from "components";

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
    <div className="container bg-white">
      <Header title={t("detail_blog")}/>

      <Stack space="1rem" className="text-base">
        <Text.Title size="xLarge"> {blog["title"]} </Text.Title>
        <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
      </Stack>
    </div>
  )
}