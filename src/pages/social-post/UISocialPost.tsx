import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { SocialPostApi } from "api";
import { Header, Info, ScrollableDiv, TailSpin } from "components";
import { useAppContext, useRouteNavigate } from "hooks";

import { ServerResponse } from "types/server";
import { StyleUtils } from "utils";

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
      return (
        <div className="flex-v center">
          <TailSpin color="secondary" width={50} height={50}/>
          <p> {t("loading")} </p>
        </div>
      )
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
      for (let i = 1; i <= posts.length; i++) {
        if (i === 4) break; // Only render the first 3 posts
        const post = posts[i - 1];
        const thumbnail = post["thumbnail"] as string;
        const imgSrc = `${SocialPostApi.getServerBaseUrl()}${thumbnail}`;
        const imgStyle = { objectFit: 'cover', maxWidth: "unset" } as React.CSSProperties;
        const content = post["content"];

        result.push(
          <div key={`post-${i}`} className="flex-v justify-between">
            <Text.Title 
              size="small" 
              className="button"
              onClick={() => goToPostDetail(post["title"], content)}
            > 
              {post["title"]} 
            </Text.Title>
            <img 
              className="button border-secondary"
              src={imgSrc || undefined} 
              style={imgStyle}
              onClick={() => goToPostDetail(post["title"], content)}
            />
          </div>
        );
      }

      return result;
    }, [ posts ]) 

    return <> {html} </>
  }

  return (
    <ScrollableDiv direction="vertical" className="flex-v" height={StyleUtils.calComponentRemainingHeight(0)}>
      {renderPosts()}
      <br/><br/>
    </ScrollableDiv>
  );
}