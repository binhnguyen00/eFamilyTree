import React from "react";
import { t } from "i18next"; 
import { Box, Text } from "zmp-ui"; 

import { BaseApi } from "api/BaseApi";
import { Header } from "components";
import { useRouteNavigate } from "hooks";

const data = [
  {
    "id": 1,
    "name": "Sierra Tarahumara",
    "cover_properties": "{\"background-image\": \"url('/website_blog/static/src/img/cover_1.jpg')\", \"resize_class\": \"o_record_has_cover o_half_screen_height\", \"opacity\": \"0\"}",
    "post_date": "2024-10-25 01:14:29",
    "website_url": "/blog/travel-1/sierra-tarahumara-1",
    "content": "\n<p class=\"lead\">Sierra Tarahumara, popularly known as Copper Canyon is situated in Mexico. The area is a favorite destination among those seeking an adventurous vacation.</p>\n<p>Copper Canyon is one of the six gorges in the area. Although the name suggests that the gorge might have some relevance to copper mining, this is not the case. The name is derived from the copper and green lichen covering the canyon. Copper Canyon has two climatic zones. The region features an alpine climate at the top and a subtropical climate at the lower levels. Winters are cold with frequent snowstorms at the higher altitudes. Summers are dry and hot. The capital city, Chihuahua, is a high altitude desert where weather ranges from cold winters to hot summers. The region is unique because of the various ecosystems that exist within it.</p>\n\n<p>Another unique feature of Copper Canyon is the presence of the Tarahumara Indian culture. These semi-nomadic people live in cave dwellings. Their livelihood chiefly depends on farming and cattle ranching.</p>\n<figure class=\"mt-2 mb-4\">\n    <img src=\"/website_blog/static/src/img/content_1_1.jpg\" class=\"img-fluid w-100\">\n    <figcaption class=\"figure-caption text-muted\">Photo by PoloX Hernandez, @elpolox</figcaption>\n</figure>\n\n<blockquote class=\"blockquote my-5\">\n    <em class=\"h4 my-0\">Apart from the native population, the local wildlife is also a major crowd puller.</em>\n    <footer class=\"blockquote-footer text-muted\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n</blockquote>\n\n<p>Several migratory and native birds, mammals and reptiles call Copper Canyon their home. The exquisite fauna in this near-pristine land is also worth checking out.</p>\n<figure class=\"mt-2 mb-4\">\n    <img src=\"/website_blog/static/src/img/content_1_2.jpg\" class=\"img-fluid w-100\">\n    <figcaption class=\"figure-caption text-muted\">Photo by Boris Smokrovic, @borisworkshop</figcaption>\n</figure>\n\n<p>A traveler may choose to explore the area by hiking around the canyon or venturing into it. Detailed planning is required for those who wish to venture into the depths of the canyon. There are a number of travel companies that specialize in organizing tours to the region. Visitors can fly to Copper Canyon using a tourist visa, which is valid for 180 days. Travelers can also drive from anywhere in the United States and acquire a visa at the Mexican customs station at the border.</p>\n<p>A holiday to the Copper Canyon promises to be an exciting mix of relaxation, culture, history, wildlife and hiking.</p>\n\n            "
  },
  {
    "id": 2,
    "name": "Sierra Tarahumara",
    "cover_properties": "{\"background-image\": \"url('/website_blog/static/src/img/cover_1.jpg')\", \"resize_class\": \"o_record_has_cover o_half_screen_height\", \"opacity\": \"0\"}",
    "post_date": "2024-10-25 01:14:29",
    "website_url": "/blog/travel-1/sierra-tarahumara-1",
    "content": "\n<p class=\"lead\">Sierra Tarahumara, popularly known as Copper Canyon is situated in Mexico. The area is a favorite destination among those seeking an adventurous vacation.</p>\n<p>Copper Canyon is one of the six gorges in the area. Although the name suggests that the gorge might have some relevance to copper mining, this is not the case. The name is derived from the copper and green lichen covering the canyon. Copper Canyon has two climatic zones. The region features an alpine climate at the top and a subtropical climate at the lower levels. Winters are cold with frequent snowstorms at the higher altitudes. Summers are dry and hot. The capital city, Chihuahua, is a high altitude desert where weather ranges from cold winters to hot summers. The region is unique because of the various ecosystems that exist within it.</p>\n\n<p>Another unique feature of Copper Canyon is the presence of the Tarahumara Indian culture. These semi-nomadic people live in cave dwellings. Their livelihood chiefly depends on farming and cattle ranching.</p>\n<figure class=\"mt-2 mb-4\">\n    <img src=\"/website_blog/static/src/img/content_1_1.jpg\" class=\"img-fluid w-100\">\n    <figcaption class=\"figure-caption text-muted\">Photo by PoloX Hernandez, @elpolox</figcaption>\n</figure>\n\n<blockquote class=\"blockquote my-5\">\n    <em class=\"h4 my-0\">Apart from the native population, the local wildlife is also a major crowd puller.</em>\n    <footer class=\"blockquote-footer text-muted\">Someone famous in <cite title=\"Source Title\">Source Title</cite></footer>\n</blockquote>\n\n<p>Several migratory and native birds, mammals and reptiles call Copper Canyon their home. The exquisite fauna in this near-pristine land is also worth checking out.</p>\n<figure class=\"mt-2 mb-4\">\n    <img src=\"/website_blog/static/src/img/content_1_2.jpg\" class=\"img-fluid w-100\">\n    <figcaption class=\"figure-caption text-muted\">Photo by Boris Smokrovic, @borisworkshop</figcaption>\n</figure>\n\n<p>A traveler may choose to explore the area by hiking around the canyon or venturing into it. Detailed planning is required for those who wish to venture into the depths of the canyon. There are a number of travel companies that specialize in organizing tours to the region. Visitors can fly to Copper Canyon using a tourist visa, which is valid for 180 days. Travelers can also drive from anywhere in the United States and acquire a visa at the Mexican customs station at the border.</p>\n<p>A holiday to the Copper Canyon promises to be an exciting mix of relaxation, culture, history, wildlife and hiking.</p>\n\n            "
  },
]

export default function UIDummyBlog() {
  return (
    <div className="container bg-white">
      <Header title={t("blogs")}/>

      <div className="text-base" style={{ minHeight: "100vh" }}>
        <UIBlogList />
      </div>
    </div>
  )
}

function UIBlogList() {
  const { goTo } = useRouteNavigate();

  const navigateToBlog = (title: string, content: string) => {
    const blog = { title, content };
    goTo("blogs/detail", { blog });
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
      const imgSrc = `${BaseApi.getServerBaseUrl()}${imageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1')}`;
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
    })

    return <>{html}</>;
  };

  return renderBlogs(data);
}