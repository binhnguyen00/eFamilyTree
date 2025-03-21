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
        const content = post["content"];

        result.push(
          <div 
            key={`post-${i}`} 
            className="post-card mb-4 rounded-lg overflow-hidden shadow-md"
            onClick={() => goToPostDetail(post["title"], content)}
            style={{
              border: '1px solid #e0e0e0',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <div className="post-img-container" style={{ height: '180px', overflow: 'hidden' }}>
              <img 
                src={imgSrc || undefined} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
                alt={post["title"]}
              />
            </div>
            <div className="post-content p-3">
              <Text.Title 
                size="small" 
                className="mb-2 line-clamp-2"
                style={{ 
                  fontWeight: 'bold',
                  minHeight: '40px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              > 
                {post["title"]} 
              </Text.Title>
              
              <div 
                className="post-preview text-sm text-gray-600 line-clamp-2"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginTop: '8px'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: content.replace(/<[^>]*>/g, ' ').substring(0, 120) + '...' 
                }}
              />
            </div>
          </div>
        );
      }

      return result;
    }, [ posts ]) 

    return <div className="px-2"> {html} </div>
  }

  return (
    <ScrollableDiv direction="vertical" className="flex-v" height={StyleUtils.calComponentRemainingHeight(0)}>
      {renderPosts()}
      <br/><br/>
    </ScrollableDiv>
  );
}
