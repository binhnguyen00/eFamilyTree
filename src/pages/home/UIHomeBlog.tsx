import React from "react";
import { t } from "i18next";
import { Box, Button, Stack, Text } from "zmp-ui";

import { SocialPostApi } from "api";
import { CommonIcon, Loading, RequestPhone } from "components";
import { useAppContext, useRouteNavigate } from "hooks";

import { ServerResponse } from "types/server";

export function UIHomeBlog() {
  const { logedIn } = useAppContext();
  const { goTo } = useRouteNavigate();
  const [ requestPhone, setRequestPhone ] = React.useState<boolean>(false);

  const goToBlogs = () => {
    if (!logedIn) {
      setRequestPhone(true);
    } else {
      goTo({ path: "blogs" });
    }
  }

  return (
    <div className="flex-v">

      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("blogs")} </Text.Title>
        <Box flex flexDirection="row" alignItems="center" alignContent="center" className="button">
          <Button 
            size="small" 
            variant="secondary" 
            suffixIcon={<CommonIcon.ChevonRight size={"1rem"}/>} 
            onClick={goToBlogs}
          >
            <Text> {t("more")} </Text>
          </Button>
        </Box>
      </Box>

      <React.Suspense fallback={<Loading/>}>
        <UISocialPosts/>
      </React.Suspense>

      <RequestPhone
        visible={requestPhone}
        closeSheet={() => setRequestPhone(false)}
      />

    </div>
  )
}

function UISocialPosts() {
  const { goTo } = useRouteNavigate();
  const { logedIn, userInfo } = useAppContext();
  const [ posts, setPosts ] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (logedIn) {
      const success = (result: ServerResponse) => {
        if (result.status === "error") {
          console.error("UIHomeBlog:\n\t", result.message);
        } else {
          const data = result.data as any[];
          setPosts(data);
        }
      };
      SocialPostApi.getSocialPosts(userInfo.id, userInfo.clanId, success);
    }
  }, [ logedIn, userInfo ]);

  const goToBlogDetail = (title: string, content: string) => {
    const blog = { title, content };
    goTo({ path: "blogs/detail", data: {blog} });
  };

  if (!posts.length) return <small> {t("no_blogs")} </small>
  else {
    let html = [] as React.ReactNode[];
    for (let i = 1; i <= posts.length; i++) {
      if (i === 4) break;
      let coverProperties: any;
      const post = posts[i - 1];
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
            className="button border-secondary"
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