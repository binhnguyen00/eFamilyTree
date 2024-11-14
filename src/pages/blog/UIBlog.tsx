import React from "react";
import { t } from "i18next";
import { Box, Stack, Text, useNavigate } from "zmp-ui"; 

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { FailResponse } from "utils/Interface";
import { CommonComponentUtils } from "components/common/CommonComponentUtils";

import UIHeader from "components/common/UIHeader";

function UIBlog() {
  return (
    <div className="container">
      <UIHeader title={t("blogs")}/>

      <UIBlogList />
    </div>
  )
}

function UIBlogList() {
  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ blogs, setBlogs ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      if (typeof result === 'string') {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setBlogs(result || []);
      }
    };

    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
      setFetchError(true);
    };

    EFamilyTreeApi.getMemberBlogs(phoneNumber, success, fail);
  }, [ reload ]);

  const navigateToBlog = (title: string, content: string) => {
    const blog = { title, content };
    navigate("/blog-detail", { state: { blog } });
  };

  const renderBlogList = (items: any[]) => {
    let html = [] as React.ReactNode[];

    if (items.length === 0) return <></>;

    items.map((item, index) => {
      let coverProperties;
      try {
        coverProperties = JSON.parse(item["cover_properties"]);
      } catch (error) {
        console.log(error);
      }
      const imageUrl = coverProperties["background-image"] as string;
      const imgSrc = `${EFamilyTreeApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`;
      const content = item["content"];

      html.push(
        <Box key={index} flex flexDirection="column">
          <Text.Title 
            size="normal" className="button"
            onClick={() => navigateToBlog(item["name"], content)}
          > 
            {item["name"]} 
          </Text.Title>
          <Text size="small"> {item["post_date"]} </Text>
          <img 
            className="button"
            src={imgSrc} 
            onClick={() => navigateToBlog(item["name"], content)}
          />
        </Box>
      );
    });

    return <Stack space="1rem">{html}</Stack>;
  };

  if (blogs.length > 0) {
    return renderBlogList(blogs);
  } else { 
    if (fetchError) {
      return CommonComponentUtils.renderError(t("server_error"), () => setReload(!reload));
    } else {
      return CommonComponentUtils.renderLoading(t("loading_blogs"));
    }
  }
}

export default UIBlog;