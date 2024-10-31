import React from "react";
import { Box, Stack, Text, Button, Page } from "zmp-ui"; 

import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
// import blogs from "./blogs.json";

export function UIBlog() {
  return (
    <Page className="page">
      {CommonComponentUtils.renderHeader("Blog List")}

      <UIBlogList />
    </Page>
  )
}

export function UIBlogList() {
  const [ data, setData ] = React.useState<any[]>([]);
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[]) => {
      /** Element in Result[]
       * id: number
       * name: string
       * cover_properties: string   <- should use JSON.parse(cover_properties)
       * content: string            <- should use JSON.parse(content)
       */
      setData(result);
    }
    const fail = (error: any) => {
      setFetchError(!fetchError);
    }
    // TODO: Replace with actual phone number. Use Provider.
    EFamilyTreeApi.getMemberBlogs(import.meta.env.VITE_DEV_PHONE_NUMBER as string, success, fail);
  }, [ reload ]);

  const renderBlogs = (items: any[]) => {
    let html = [] as React.ReactNode[];
    if (items.length === 0) return html;

    items.map((item, index) => {
      const coverProperties = JSON.parse(item["cover_properties"]);
      const imageUrl = coverProperties["background-image"] as string;
      // const imgSrc = `${EFamilyTreeApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`
      html.push(
        <Box key={index} flex flexDirection="column">
          <Text.Title size="normal">{item["name"]}</Text.Title>
          <Text size="small">{item["post_date"]}</Text>
          {/* <img src={imgSrc} alt=""/> */}
          <img src={imageUrl} alt=""/>
        </Box>
      )
    })

    return html;
  }

  return (
    <>
      {
        data.length > 0 ? (
          <Stack className="flex-v" space="1rem">
            {renderBlogs(data)}
          </Stack>
        ) : (
          !reload ? (
            <Box flex flexDirection="column" alignItems="center">
              <Text.Title size="small">{"Loading..."}</Text.Title>
            </Box>
          ) : (
            <Box flex flexDirection="column" justifyContent="center" alignItems="center">
              <Text.Title size="small">{"No Blogs available"}</Text.Title>
              <Button size="small" onClick={() => setReload(!reload)}>
                {"Retry"}
              </Button>
            </Box>
          )
        )
      }
    </>
  )
}