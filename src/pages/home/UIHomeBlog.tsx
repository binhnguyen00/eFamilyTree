import React from "react";
import { t } from "i18next";
import { Box, Stack, Text, useNavigate } from "zmp-ui";
import { logedInState, phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse } from "utils/type";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import { CommonIcon } from "components";

export function UIHomeBlog() {
  const [ blogs, setBlogs ] = React.useState<any[]>([]);

  const navigate = useNavigate();
  const loginedIn = useRecoilValue(logedInState);
  const phoneNumber = useRecoilValue(phoneState);

  React.useEffect(() => {
    if (loginedIn) {
      const success = (result: any[] | string) => {
        if (typeof result === 'string') console.warn(result);
        else setBlogs(result || []);
      };
      const fail = (error: FailResponse) => console.error(error.stackTrace);
      EFamilyTreeApi.getMemberBlogs(phoneNumber, success, fail);
    }
  }, [loginedIn, phoneNumber]);

  const goToBlogDetail = (title: string, content: string) => {
    const blog = { title, content };
    navigate("/blog-detail", { state: { blog } });
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
        const imgSrc = `${EFamilyTreeApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`;
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
        <Text.Title size="xLarge" className="text-capitalize"> {t("blogs")} </Text.Title>
        {blogs.length ? (
          <Box flex flexDirection="row" alignItems="center" className="button" onClick={goToBlogs}>
            <Text size="small"> {t("more")} </Text>
            <CommonIcon.ChevonRight size={"1rem"}/>
          </Box>
        ) : null}
      </Box>

      {renderBlogs()}

    </Stack>
  )
}