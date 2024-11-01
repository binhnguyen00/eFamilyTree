import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Stack, Text, Button, Page, useNavigate } from "zmp-ui"; 

import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { PhoneNumberContext } from "../../pages/main";


export function UIBlog() {
  const { t } = useTranslation();
  return (
    <Page>
      {CommonComponentUtils.renderHeader(t("blogs"))}

      <div className="container">
        <UIBlogList />
      </div>
    </Page>
  )
}

export function UIBlogList() {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const phoneNumber = React.useContext(PhoneNumberContext);
  const [ data, setData ] = React.useState<any[]>([]);
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {

    const success = (result: any[] | string) => {
      /** Element in Result[]
       * id: number
       * name: string
       * cover_properties: string   <- should use JSON.parse(cover_properties)
       * content: string            <- should use JSON.parse(content)
       */
      setLoading(false);
      if (typeof result === 'string') {
        setFetchError(true);
      } else {
        setData(result);
      }
    }

    const fail = (error: any) => {
      setLoading(false);
      setFetchError(true);
    }

    const fetchData = () => {
      setLoading(true);
      setFetchError(false);
      EFamilyTreeApi.getMemberBlogs(phoneNumber, success, fail);
    };

    fetchData();
  }, [ reload, phoneNumber ]);

  const renderBlog = (title: string, content: string) => {
    const blog = {
      title: title,
      content: content
    }
    navigate("/blog-detail", { state: { blog } });
    navigate = undefined as any;
  }

  const renderBlogs = (items: any[]) => {
    let html = [] as React.ReactNode[];
    if (items.length === 0) return html;

    items.map((item, index) => {
      const coverProperties = JSON.parse(item["cover_properties"]);
      const imageUrl = coverProperties["background-image"] as string;
      const imgSrc = `${EFamilyTreeApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`
      const content = item["content"];

      html.push(
        <Box key={index} flex flexDirection="column">
          <Text.Title 
            size="normal" className="button"
            onClick={() => renderBlog(item["name"], content)}
          > 
            {item["name"]} 
          </Text.Title>
          <Text size="small"> {item["post_date"]} </Text>
          <img 
            className="button"
            src={imgSrc} 
            onClick={() => renderBlog(item["name"], content)}/>
        </Box>
      )
    })

    return html;
  }

  return (
    <>
      {loading ? (
        CommonComponentUtils.renderLoading()
      ) : fetchError ? (
        CommonComponentUtils.renderError("server_error", () => setReload((prev) => !prev))
      ) : data.length > 0 ? (
        <Stack className="flex-v" space="1rem">
          {renderBlogs(data)}
        </Stack>
      ) : (
        CommonComponentUtils.renderRety("no_blogs", () => setReload((prev) => !prev))
      )}
    </>
  );
}