import React from "react";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";

import { StyleUtils } from "utils";
import { SocialPostApi } from "api";
import { useAppContext, useRouteNavigate } from "hooks";
import { Card, Header, Loading, ScrollableDiv, Selection, SelectionOption } from "components";

import { ServerResponse } from "types/server";

export enum SocialPostType {
  FUND = "fund",
  NEWS = "news",
  ALL  = "all"
}

export function useSocialPosts(type: SocialPostType = SocialPostType.NEWS) {
  const { logedIn, userInfo } = useAppContext();

  const [ posts, setPosts ] = React.useState<any[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    console.log(type);

    setLoading(true);
    setError(false);
    setPosts([]);

    if (logedIn) {
      SocialPostApi.getSocialPosts({
        userId: userInfo.id,
        clanId: userInfo.clanId,
        type  : type,
        successCB: (result: ServerResponse) => {
          setLoading(false);
          if (result.status === "error") {
            setPosts([]);
            setError(true);
          } else {
            const data = result.data as any[];
            setPosts(data);
          }
        },
        failCB: () => {
          setLoading(false);
          setError(true);
        }
      });
    } else {
      setLoading(false);
      setError(true);
    }
  }, [ logedIn, userInfo, reload, type ]);

  return { posts, loading, error, refresh }
}

export function UISocialPost() {
  const [ type, setType ] = React.useState<SocialPostType>(SocialPostType.NEWS);
  const options: any[] = [
    { value: SocialPostType.NEWS, label: t("Tin Đăng") },
    { value: SocialPostType.FUND, label: t("Quỹ") },
    { value: SocialPostType.ALL, label: t("Tất Cả") },
  ]
  const { posts, error, loading, refresh } = useSocialPosts(type);

  const renderContainer = () => {
    const renderNoPost = () => {
      return (
        <div className="flex-v">
          <Text.Title size="small" className="text-primary text-center text-capitalize py-1"> {t("no_blogs")} </Text.Title>
          <div className="center"> <Button size="small" onClick={refresh}> {t("retry")} </Button> </div>
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

      <div className="container bg-white text-base flex-v">
        <div>
          <Text.Title size="small" className="text-primary text-capitalize py-1"> {t("lọc bài đăng")} </Text.Title>
          <Selection
            options={options}
            defaultValue={options[0]}
            onChange={(selected: SelectionOption, action) => setType(selected.value)} 
            isClearable={false} isSearchable={false}
            label={""} field={""} observer={null as any}
          />
        </div>

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
      id="ui-social-post"
      direction="vertical" className="flex-v" 
      height={StyleUtils.calComponentRemainingHeight(10)}
    >
      {renderPosts()}
      <br/><br/>
    </ScrollableDiv>
  );
}
