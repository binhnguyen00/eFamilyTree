import React from "react";
import { t } from "i18next";
import { Stack, Swiper, Text as ZText } from "zmp-ui";

import banner_01 from "assets/img/banner/banner-01.jpg";
import banner_02 from "assets/img/banner/banner-02.jpg";
import banner_03 from "assets/img/banner/banner-03.jpg";

import UIImageWithText from "components/common/UIImageWithText";

export default function UIHomeBanner() {

  return (
    <Stack space="0.5rem">
      <ZText.Title size="xLarge"> {t("family_tree")} </ZText.Title>
      <Swiper loop autoplay>
        <Swiper.Slide>
          <React.Suspense>
            <UIImageWithText 
              text={
                <Stack space="1rem">
                  <p>{"Gìn Giữ Giá Trị"}</p>
                  <p>{"Gia Tộc"}</p>
                </Stack>
              }
              textStyle={{ fontSize: "2rem" }}
              src={banner_01}
              height={150}
            />
          </React.Suspense>
        </Swiper.Slide>
        <Swiper.Slide>
          <React.Suspense>
            <UIImageWithText 
              text={
                <Stack space="1rem">
                  <p>{"Công Nghệ Lưu Giữ"}</p>
                  <p>{"Giá Trị Truyền Thống"}</p>
                </Stack>
              }
              textStyle={{ fontSize: "1.5rem" }}
              src={banner_02}
              height={150}
            />
          </React.Suspense>
        </Swiper.Slide>
        <Swiper.Slide>
          <React.Suspense>
            <UIImageWithText 
              text={<p> {"Kết Nối Dòng Họ"} </p>}
              textStyle={{ fontSize: "2rem" }}
              src={banner_03}
              height={150}
            />
          </React.Suspense>
        </Swiper.Slide>
      </Swiper>
    </Stack>
  )
}