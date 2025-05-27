import React from "react";
import DOMPurify from "dompurify";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { DivUtils } from "utils";
import { BaseApi, SocialPostApi } from "api";
import { PageMode, PagePermissions, ServerResponse, SocialPost } from "types";
import { useAppContext, useBeanObserver, useNotification, useRouteNavigate } from "hooks";
import { Header, ScrollableDiv, RichTextEditor, CommonIcon } from "components";

export function UISocialPost() {
  const { userInfo } = useAppContext();
  const { belongings, goBack } = useRouteNavigate();
  const { loadingToast } = useNotification();
  const { post, permissions, pageMode } = belongings as {
    pageMode: PageMode,
    post: SocialPost,
    permissions: PagePermissions
  }
  const observer = useBeanObserver(post);

  const onSave = () => {
    loadingToast({
      content: t("Lưu bài đăng..."),
      operation: (onSuccess, onFail) => {
        SocialPostApi.savePost({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          post: {
            id      : observer.getBean().id,
            title   : observer.getBean().title,
            content : observer.getBean().content,
            type    : observer.getBean().type,
          },
          successCB: (result: ServerResponse) => {
            onSuccess(t("Thành công"));
          },
          failCB: () => {
            onFail(t("Thất bại"));
          }
        });
      }
    });
  }

  const onDelete = () => {
    loadingToast({
      content: t("Xóa bài đăng..."),
      operation: (onSuccess, onFail) => {
        SocialPostApi.deletePost({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          postId: observer.getBean().id!,
          successCB: (result: ServerResponse) => {
            goBack();
            onSuccess(t("Thành công"));
          },
          failCB: () => {
            onFail(t("Thất bại"));
          }
        });
      }
    });
  }

  const renderContent = () => {
    if ([PageMode.EDIT, PageMode.CREATE].includes(pageMode)) {
      const hasContent = !!observer.getBean().content;
      return (
        <div className="py-3">
          <Input label={t("tiêu đề")} value={observer.getBean().title} name="title" onChange={observer.watch}/>
          <RichTextEditor
            field="content" observer={observer} height={DivUtils.calculateHeight(120)} value={observer.getBean().content}
            placeholder={hasContent ? `${t("Bài viết")} của ${name}` : t("Bắt đầu viết bài...")}
          />
          <div className="p-2 flex-h" style={{ position: "absolute", right: 0, bottom: 0 }}>
            <Button size="small" variant="primary" prefixIcon={<CommonIcon.Save/>} onClick={onSave}>
              {t("save")}
            </Button>
            <Button size="small" variant="primary" prefixIcon={<CommonIcon.Trash/>} onClick={onDelete}>
              {t("delete")}
            </Button>
          </div>
        </div>
      )
    } else if (PageMode.VIEW === pageMode) { // return view mode
      const addDomainToImageSrc = (html: string) => {
        return html.replace(/<img\s+([^>]*?)src="([^"]*?)"/g, (match, attrs, src) => {
          // Ensure the src doesn't already have a domain due to Odoo
          const newSrc = src.startsWith("http") ? src : `${BaseApi.getServerBaseUrl()}${src}`;
          return `<img ${attrs} src="${newSrc}"`;
        });
      };
      const purifiedContent = DOMPurify.sanitize(post.content);
      const updatedContent = addDomainToImageSrc(purifiedContent);
      return (
        <div className="py-3">
          <Text.Title className="py-2" size="xLarge"> 
            {post.title} 
          </Text.Title>
          <Text size="small" className="text-gray-500 p-3">
            {post.creatorName}
          </Text>
          <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
        </div>
      )
    } else {
      return <></>
    }
  }

  return (
    <>
      <Header title={t("detail_blog")}/>

      <ScrollableDiv 
        id="ui-social-post-detail"
        direction="vertical" height={"100%"}
        className="container bg-white text-base"
      >
        {renderContent()}
      </ScrollableDiv>
    </>
  )
}