import React from "react";
import { t } from "i18next";
import { Swiper } from "zmp-ui";

import { ImageWithText } from "components";

import slide_01 from "assets/img/about/about-swiper-1.jpg";
import slide_02 from "assets/img/about/about-swiper-2.jpg";

export function UIAbout() {
  return (
    <div className="container max-h bg-white flex-v">
      <Swiper loop>
        <Swiper.Slide>
          <ImageWithText
            text={
              <div className="flex-v center charmonman-regular">
                <p> {t("Tự hào và Hãnh diện")} </p>
                <p> {t("Đồng hành cùng khách hàng")} </p>
              </div>
            }
            textStyle={{ fontSize: "1.6rem" }}
            src={slide_01}
            height={160}
          />
        </Swiper.Slide>
        <Swiper.Slide>
          <ImageWithText
            text={
              <div className="flex-v center charmonman-regular">
                <p> {t("Cùng Việt Nam")} </p>
                <p> {t("Chuyển đổi số")} </p>
              </div>
            }
            textStyle={{ fontSize: "2rem" }}
            src={slide_02}
            height={160}
          />
        </Swiper.Slide>
      </Swiper>          
    </div>
  );
};