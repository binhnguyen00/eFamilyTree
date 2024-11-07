import React from "react";
import { t } from "i18next";
import { Box, Text, useNavigate } from "zmp-ui"; 

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { CommonComponentUtils } from "../../utils/CommonComponentUtils";

export function UIBlog() {
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("blogs"))}

      <UIBlogList />
    </div>
  )
}

export function UIBlogList() {
  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ blogs, setBlogs ] = React.useState<any[]>([]);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[]) => {
      setFetchError(false);
      setBlogs(result);
    };

    const fail = (error: any) => {
      console.error(error.stackTrace);
      setFetchError(true);
    };

    EFamilyTreeApi.getMemberBlogs(phoneNumber, success, fail);
  }, [ fetchError ]);

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

    return <>{html}</>;
  };

  if (blogs.length > 0) {
    return renderBlogList(blogs);
  } else { 
    if (fetchError) {
      return CommonComponentUtils.renderError(t("server_error"), () => setFetchError(true));
    } else {
      return CommonComponentUtils.renderLoading(t("loading_blogs"));
    }
  }
}
