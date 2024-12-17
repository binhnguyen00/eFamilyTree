import React from "react";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Text } from "zmp-ui";

import { AutoLoginContext, CommonIcon } from "components";
import { SocialPostApi } from "api";
import { FailResponse, ServerResponse } from "server";

export function UIHomeBlog() {
  const navigate = useNavigate();
  const [ blogs, setBlogs ] = React.useState<any[]>([]);
  const { logedIn, phone } = React.useContext(AutoLoginContext);

  React.useEffect(() => {
    if (logedIn) {
      const success = (result: ServerResponse) => {
        if (result.status === "error") {
          console.error("UIHomeBlog:\n\t", result.message);
        } else {
          const data = result.data as any[];
          setBlogs(data);
        }
      };
      const fail = (error: FailResponse) => {
        console.error("UIHomeBlog:\n\t", error.stackTrace);
      }
      SocialPostApi.getSocialPosts(phone, success, fail);
    }
  }, [ logedIn ]);

  const goToBlogDetail = (title: string, content: string) => {
    const blog = { title, content };
    navigate("/blogs/detail", { state: { blog } });
  };

  const goToBlogs = () => {
    navigate("/blogs");
  }

  const renderBlogs = () => {
    if (!blogs.length) {
      return (
        <>
          <Text size="small">{ t("no_blogs") }</Text>
          <Box flex flexDirection="row" alignItems="center" justifyContent="center" className="button-link">
            <CommonIcon.Plus size={"1rem"}/>
            <Text size="small" className="ml-1"> {t("create")} </Text>
          </Box>
        </>
      )
    } else {
      let html = [] as React.ReactNode[];
      for (let i = 1; i <= blogs.length; i++) {
        if (i === 4) break;
        let coverProperties;
        const post = blogs[i - 1];
        try {
          coverProperties = JSON.parse(post["cover_properties"]);
        } catch (error) {
          console.log(error);
        }

        const imageUrl = coverProperties["background-image"] as string;
        const imgSrc = `${SocialPostApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`;
        const imgStyle = { width: 300, height: 180, objectFit: 'cover', maxWidth: "unset" } as React.CSSProperties;
        const content = post["content"];

        html.push(
          <Stack key={`blog-${i}`} space="0.5rem">
            <Text.Title 
              size="small" className="button"
              onClick={() => goToBlogDetail(post["name"], content)}
            > 
              {post["name"]} 
            </Text.Title>
            <Text size="small"> {post["post_date"]} </Text>
            <img 
              className="button"
              src={imgSrc || undefined} 
              style={imgStyle}
              onClick={() => goToBlogDetail(post["name"], content)}
            />
          </Stack>
        );
      }
      return (
        <div className="scroll-h flex-h">
          {html}
        </div>
      )
    }
  }

  return (
    <Stack space="0.5rem">

      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("blogs")} </Text.Title>
        {blogs.length ? (
          <Box flex flexDirection="row" alignItems="center" alignContent="center" className="button">
            <Button size="small" variant="secondary" suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} onClick={goToBlogs}>
              <Text> {t("more")} </Text>
            </Button>
          </Box>
        ) : null}
      </Box>

      {renderBlogs()}

    </Stack>
  )
}