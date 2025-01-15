import React from "react";
import { t } from "i18next"; 
import { Box, Text } from "zmp-ui"; 

import { BaseApi } from "api/BaseApi";
import { Header } from "components";
import { useRouteNavigate } from "hooks";

import data from "./sample/blogs.json"; 

export default function UIDummyBlog() {
  return (
    <div className="container bg-white">
      <Header title={t("blogs")}/>

      <div className="text-base" style={{ minHeight: "100vh" }}>
        <UIBlogList />
      </div>
    </div>
  )
}

function UIBlogList() {
  const { goTo } = useRouteNavigate();

  const navigateToBlog = (title: string, content: string) => {
    const blog = { title, content };
    goTo({ path: "blogs/detail", data: { blog } });
  };

  const renderBlogs = (items: any[]) => {
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
      const imgSrc = `${BaseApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`;
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
    })

    return <>{html}</>;
  };

  return renderBlogs(data);
}