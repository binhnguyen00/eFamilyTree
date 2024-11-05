import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Text, useNavigate } from "zmp-ui"; 

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { PhoneNumberContext } from "../../pages/main";


export function UIBlog() {
  const { t } = useTranslation();
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("blogs"))}

      <UIBlogList />
    </div>
  )
}

export function UIBlogList() {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const phoneNumber = React.useContext(PhoneNumberContext);
  const [data, setData] = React.useState<any[]>([]);
  const [fetchError, setFetchError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [reload, setReload] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[]) => {
      setLoading(false);
      setData(result);
    };

    const fail = (error: any) => {
      setLoading(false);
      setFetchError(true);
    };

    const fetchData = () => {
      setLoading(true);
      setFetchError(false);
      EFamilyTreeApi.getMemberBlogs(phoneNumber, success, fail);
    };

    fetchData();
  }, [reload, phoneNumber]);

  const navigateToBlog = (title: string, content: string) => {
    const blog = { title, content };
    navigate("/blog-detail", { state: { blog } });
  };

  const renderBlogs = (items: any[]) => {
    let html = [] as React.ReactNode[];

    if (items.length === 0) return <></>;

    items.map((item, index) => {
      let coverProperties;
      try {
        coverProperties = JSON.parse(item["cover_properties"]);
      } catch (error) {
        console.log(error);
      }
      const imageUrl = coverProperties["background-image"] as string;
      const imgSrc = `${EFamilyTreeApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`;
      const content = item["content"];

      html.push(
        <Box key={index} flex flexDirection="column">
          <Text.Title 
            size="normal" className="button"
            onClick={() => navigateToBlog(item["name"], content)}
          > 
            {item["name"]} 
          </Text.Title>
          <Text size="small"> {item["post_date"]} </Text>
          <img 
            className="button"
            src={imgSrc} 
            onClick={() => navigateToBlog(item["name"], content)}
          />
        </Box>
      );
    });

    return <>{html}</>;
  };

  return (
    loading ? (
      CommonComponentUtils.renderLoading(t("loading_blogs"))
    ) : fetchError ? (
      CommonComponentUtils.renderError(t("server_error"), () => setReload((prev) => !prev))
    ) : data.length > 0 ? (
      renderBlogs(data)
    ) : (
      CommonComponentUtils.renderRetry(t("no_blogs"), () => setReload((prev) => !prev))
    )
  );
}
