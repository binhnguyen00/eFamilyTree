import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Box, Stack, Text } from "zmp-ui";

import { useRecoilValue } from "recoil";
import { phoneState } from "states";

import { Error, Header, Loading } from "components";
import { EFamilyTreeApi, FailResponse, ServerResponse } from "utils";

export function UIBlog() {
  return (
    <div className="container">
      <Header title={t("blogs")}/>

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
    const success = (result: ServerResponse) => {
      if (result.status === "error") {
        console.error("UIBlogList:\n\t", result.message);
      } else {
        const data = result.data as any[];
        setBlogs(data);
      }
    };
    const fail = (error: FailResponse) => {
      console.error("UIBlogList:\n\t", error.stackTrace);
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
      return <Error message={t("server_error")} onRetry={() => setReload(!reload)}/> 
    } else {
      return <Loading message={t("loading_blogs")}/> 
    }
  }
}