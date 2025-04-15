import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";
import DOMPurify from "dompurify";

import { BaseApi } from "api";
import { useRouteNavigate } from "hooks";
import { Header, ScrollableDiv } from "components";

export function UISocialPostDetail() {
  const { belongings } = useRouteNavigate()
  const { post } = belongings || {
    title: "",
    content: "",
  };

  const purifiedContent = DOMPurify.sanitize(post["content"]);
  
  const addDomainToImageSrc = (html: string) => {
    return html.replace(/<img\s+([^>]*?)src="([^"]*?)"/g, (match, attrs, src) => {
      // Ensure the src doesn't already have a domain due to Odoo
      const newSrc = src.startsWith("http") ? src : `${BaseApi.getServerBaseUrl()}${src}`;
      return `<img ${attrs}src="${newSrc}"`;
    });
  };

  const updatedContent = addDomainToImageSrc(purifiedContent);

  return (
    <>
      <Header title={t("detail_blog")}/>

      <ScrollableDiv 
        id="ui-social-post-detail"
        direction="vertical" height={"100%"}
        className="container bg-white text-base flex-v"
      >
        <Text.Title className="py-2" size="xLarge"> 
          {post["title"]} 
        </Text.Title>

        <div dangerouslySetInnerHTML={{ __html: updatedContent }} />

        <br/><br/>
      </ScrollableDiv>
    </>
  )
}