import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { StyleUtils } from "utils";
import { SocialPostApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { Card, Header, Info, Loading, ScrollableDiv } from "components";

import { ServerResponse } from "types/server";

export function useSocialPosts() {
  const { logedIn, userInfo } = useAppContext();

  const [ posts, setPosts ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setPosts([]);

    if (logedIn) {
      const success = (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "error") {
          setPosts([]);
          setError(true);
        } else {
          const data = result.data as any[];
          setPosts(data);
        }
      };
      const fail = () => {
        setLoading(false);
        setError(true);
      }
      SocialPostApi.getSocialPosts(userInfo.id, userInfo.clanId, success, fail);
    } else {
      setLoading(false);
      setError(true);
    }
  }, [ logedIn, userInfo, reload ]);

  return { posts, loading, error, refresh }
}

export function UISocialPost() {
  const { posts, error, loading, refresh } = useSocialPosts();

  const renderContainer = () => {

    const renderNoPost = () => {
      return (
        <div className="flex-v center">
          <Info title={t("no_blogs")}/>
          <Button size="small" onClick={refresh}> {t("retry")} </Button>
        </div>
      )
    }

    if (loading) {
      return <Loading/>
    } else if (error) {
      return renderNoPost();
    } else if (!posts.length) {
      return renderNoPost();
    } else {
      return (
        <UISocialPosts posts={posts}/>
      )
    }
  }

  return (
    <>
      <Header title={t("blogs")}/>

      <div className="container bg-white text-base">
        {renderContainer()}
      </div>
    </>
  )
}

interface UISocialPostsProps {
  posts: any[];
}
function UISocialPosts(props: UISocialPostsProps) {
  const { posts } = props;
  const { goTo } = useRouteNavigate();

  const goToPostDetail = (title: string, content: string) => {
    const post = { title, content };
    goTo({ path: "social-posts/detail", belongings: { post } });
  };

  const renderPosts = () => {
    const html: React.ReactNode[] = React.useMemo(() => {
      if (!posts.length) return [];
      
      const result = [] as React.ReactNode[];
      for (let i = 0; i < posts.length; i++) {
        const post: any         = posts[i];
        const title: string     = post["title"] || "";
        const content: string   = post["content"] || "";
        const thumbnail: string = post["thumbnail"] || "";
        const imgSrc: string    = `${SocialPostApi.getServerBaseUrl()}${thumbnail}`;

        result.push(
          <Card
            key={`post-${i}`}
            src={imgSrc}
            className="button rounded border-secondary mb-3"
            onClick={() => goToPostDetail(title, content)}
            title={<Text.Title size="xLarge"> {title} </Text.Title>} 
            content={
              <Text size="small" className="text-gray-500 p-3">
                {`${content.replace(/<[^>]*>/g, ' ').substring(0, 120)}...`}
              </Text>
            }
          />
        );
      }

      return result;
    }, [ posts ]) 

    return html;
  }

  return (
    <ScrollableDiv 
      direction="vertical" 
      className="flex-v" 
      height={StyleUtils.calComponentRemainingHeight(10)}
    >
      <br/>
      {renderPosts()}
      <br/><br/>
    </ScrollableDiv>
  );
}
