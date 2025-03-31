import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";

import { SocialPostApi } from "api";
import { TailSpin } from "components";
import { useRouteNavigate } from "hooks";

import { useSocialPosts } from "pages/social-post/UISocialPost";

export function UIHomeSocialPost() {
  const { posts, error, loading, refresh } = useSocialPosts();

  const renderContainer = () => {
    if (loading) {
      return (
        <div className="flex-v">
          <TailSpin color="secondary" width={50} height={50}/>
          <p> {t("loading")} </p>
        </div>
      )
    } else if (error) {
      return <small>{t("no_blogs")}</small>;
    } else if (!posts.length) {
      return <small>{t("no_blogs")}</small>;
    } else {
      return (
        <UISocialPosts posts={posts}/>
      )
    }
  }

  return renderContainer()
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
        const title = post["title"] as string;
        const thumbnail = post["thumbnail"] as string;
        const imgSrc = `${SocialPostApi.getServerBaseUrl()}${thumbnail}`;
        const imgStyle = { width: 300, height: 180, objectFit: 'cover', maxWidth: "unset" } as React.CSSProperties;
        const content = post["content"];

        result.push(
          <div key={`post-${i}`} className="flex-v justify-between">
            <Text.Title 
              size="small" 
              className="button"
              onClick={() => goToPostDetail(title, content)}
            > 
              {title} 
            </Text.Title>
            <img 
              className="button border-secondary"
              src={imgSrc || undefined} 
              style={imgStyle}
              onClick={() => goToPostDetail(title, content)}
            />
          </div>
        );
      }

      return result;
    }, [ posts ]);

    return <> {html} </>
  }

  return (
    <div className="scroll-h">
      {renderPosts()}
    </div>
  )
}