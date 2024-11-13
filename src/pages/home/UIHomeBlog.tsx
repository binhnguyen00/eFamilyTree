import React from "react";
import { t } from "i18next";
import { Box, Stack, Text, useNavigate } from "zmp-ui";
import { logedInState, phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse } from "utils/Interface";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";

import UIDivider from "components/common/UIDivider";

export default function UIHomeBlog() {
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

  const navigateToBlog = (title: string, content: string) => {
    const blog = { title, content };
    navigate("/blog-detail", { state: { blog } });
  };

  const renderBlogs = () => {
    if (!blogs.length) {
      return <Text size="small">{ t("no_blogs") }</Text>
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
        const content = post["content"];

        html.push(
          <Box key={`blog-${i}`} flex flexDirection="column">
            <Text.Title 
              size="normal" className="button"
              onClick={() => navigateToBlog(post["name"], content)}
            > 
              {post["name"]} 
            </Text.Title>
            <Text size="small"> {post["post_date"]} </Text>
            <img 
              className="button"
              src={imgSrc} 
              onClick={() => navigateToBlog(post["name"], content)}
            />
          </Box>
        );
      }
      return (
        <Box flex flexDirection="row" justifyContent="center" alignItems="center">
          {html}
        </Box>
      )
    }
  }

  return (
    <Stack space="0.5rem">
      <Box flex flexDirection="row" justifyContent="space-between">
        <Text.Title className="text-capitalize"> {t("blogs")} </Text.Title>
      </Box>
      <UIDivider/>
      {renderBlogs()}
    </Stack>
  )
}