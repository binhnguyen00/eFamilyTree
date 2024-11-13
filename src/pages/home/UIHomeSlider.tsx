import React from "react";
import { t } from "i18next";
import { Stack, Swiper, Text as ZText } from "zmp-ui";

import banner_01 from "assets/img/banner/banner-01.jpg";
import banner_02 from "assets/img/banner/banner-02.jpg";
import banner_03 from "assets/img/banner/banner-03.jpg";

import UIImageWithText from "components/common/UIImageWithText";

export function UIHomeSlider() {

  return (
    <Stack space="0.5rem">
      <ZText.Title> {t("family_tree")} </ZText.Title>
      <Swiper loop>
        <Swiper.Slide>
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
        </Swiper.Slide>
        <Swiper.Slide>
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
        </Swiper.Slide>
        <Swiper.Slide>
          <UIImageWithText 
            text="Kết Nối Dòng Họ"
            textStyle={{ fontSize: "2rem" }}
            src={banner_03}
            height={150}
          />
        </Swiper.Slide>
      </Swiper>
    </Stack>
  )
}