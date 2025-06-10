import React from "react";
import classNames from "classnames";
import { t } from "i18next";
import { Button, Text } from "zmp-ui";
import { PhotoProvider, PhotoView } from "react-photo-view";

import { DivUtils } from "utils";
import { SocialPostApi } from "api";
import { PageMode, ServerResponse, SocialPost } from "types";
import { useAppContext, usePageContext, useRouteNavigate } from "hooks";
import { CommonIcon, Divider, Header, Loading, Retry, ScrollableDiv, Selection, SelectionOption } from "components";

export enum SocialPostType {
  FUND = "fund",
  NEWS = "news",
  ALL  = "all"
}

export function useSocialPosts(type: SocialPostType = SocialPostType.NEWS) {
  const { logedIn, userInfo } = useAppContext();

  const [ posts, setPosts ] = React.useState<SocialPost[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  const convert = (posts: any[]) => {
    return posts.map((post: any) => {
      return {
        id            : post.id,
        title         : post.title,
        content       : post.content,
        type          : post.type,
        creatorId     : post.creator_id,
        creatorName   : post.creator,
        thumbnail     : post.thumbnail,
        createDate    : post.create_date,
      } as SocialPost;
    })
  }

  React.useEffect(() => {
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
            const raws: SocialPost[] = convert(data);
            setPosts(raws);
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

export function UISocialPosts() {
  const { goTo } = useRouteNavigate();
  const { userInfo } = useAppContext();
  const { permissions } = usePageContext();
  const [ type, setType ] = React.useState<SocialPostType>(SocialPostType.NEWS);
  const options: any[] = [
    { value: SocialPostType.NEWS, label: t("Tin Đăng") },
    { value: SocialPostType.FUND, label: t("Quỹ") },
    { value: SocialPostType.ALL, label: t("Tất Cả") },
  ]
  const { posts, error, loading, refresh } = useSocialPosts(type);

  const goToPost = (post: SocialPost, pageMode: PageMode) => {
    goTo({ 
      path: "social-posts/detail", 
      belongings: { post, permissions, pageMode }, 
    })
  }

  const createPost = (
    post: {
      title: string;
      content: string;
      type: SocialPostType;
    },
  ) => goTo({ 
    path: "social-posts/detail", 
    belongings: { post, permissions, pageMode: PageMode.CREATE },
  })

  const renderPosts = React.useMemo(() => {
    if (!posts.length) return [];
    
    const html: React.ReactNode[] = posts.map((post: SocialPost, index: number) => {
      const title: string     = post.title || "";
      const content: string   = post.content || "";
      const thumbnail: string = post.thumbnail || "";
      const imgSrc: string    = `${SocialPostApi.getServerBaseUrl()}${thumbnail}`;
      const isOwner: boolean  = post.creatorId === userInfo.id;
      return (
        <div key={`post-${index}`} className="flex-v box-shadow rounded p-2 button">
          <PhotoProvider maskOpacity={0.5} maskClosable pullClosable bannerVisible={false}>
            <PhotoView src={imgSrc}>
              <img src={imgSrc} alt={title} className="rounded object-cover w-full h-60"/>
            </PhotoView>
          </PhotoProvider>
          <div onClick={() => goToPost(post, permissions.canModerate && isOwner ? PageMode.EDIT : PageMode.VIEW)}>
            <Text.Title size="xLarge"> {title} </Text.Title>
            <Text size="small" className="text-gray-500">
              {`${content.replace(/<[^>]*>/g, ' ').substring(0, 120)}...`}
            </Text>
          </div>
        </div>
      );
    })

    return html;
  }, [ posts ])

  const renderContainer = () => {
    if (loading) {
      return <Loading/>
    } else if (error) {
      return <Retry title={t("Chưa có bài đăng")} onClick={refresh}/>
    } else if (!posts.length) {
      return <Retry title={t("Chưa có bài đăng")} onClick={refresh}/>
    } else {
      return (
        <ScrollableDiv
          id="ui-social-post"
          direction="vertical" className="flex-v" 
          height={DivUtils.calculateHeight(10)}
        >
          {renderPosts}
          <Divider size={0}/>
          <Divider size={0}/>
        </ScrollableDiv>
      )
    }
  }

  return (
    <>
      <Header title={t("blogs")}/>

      <div className="container bg-white text-base flex-v relative">
        <div>
          <Text.Title size="small" className="text-primary text-capitalize py-1"> {t("lọc bài đăng")} </Text.Title>
          <Selection
            options={options}
            defaultValue={options.find((option: any) => option.value === type)}
            onChange={(selected: SelectionOption, action) => setType(selected.value)} 
            isClearable={false} isSearchable={false}
            label={""} field={""} observer={null as any}
          />
        </div>

        {renderContainer()}

        <div className="absolute bottom-4 right-3 flex-v">
          <Button
            size="small" variant="primary" prefixIcon={<CommonIcon.Plus/>} className={classNames(!permissions.canModerate && "hide")}
            onClick={() => createPost({ title: "Kêu gọi đóng quỹ", content: "", type: SocialPostType.FUND })}
          >
            {t("quỹ")}
          </Button>
          <Button
            size="small" variant="primary" prefixIcon={<CommonIcon.Plus/>} className={classNames(!permissions.canModerate && "hide")}
            onClick={() => createPost({ title: "Bài đăng mới", content: "", type: SocialPostType.NEWS })}
          >
            {t("bài đăng")}
          </Button>
        </div>
      </div>
    </>
  )
}