import React from "react";
import { t } from "i18next";
import { Text, Swiper } from "zmp-ui";

import { Header, ImageWithText } from "components";

import slide_01 from "assets/img/about/about-swiper-1.jpg";
import slide_02 from "assets/img/about/about-swiper-2.jpg";

export function UIAbout() {
  return (
    <>
      <Header title={t("about")}/>
      <div className="container max-h bg-white flex-v">
        <Swiper loop>
          <Swiper.Slide>
            <ImageWithText
              text={
                <div className="flex-v center charmonman-regular">
                  <p> {"Tự hào và Hãnh diện"} </p>
                  <p> {"Đồng hành cùng khách hàng"} </p>
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
                  <p> {"Cùng Việt Nam"} </p>
                  <p> {"Chuyển đổi số"} </p>
                </div>
              }
              textStyle={{ fontSize: "2rem" }}
              src={slide_02}
              height={160}
            />
          </Swiper.Slide>
        </Swiper>          

        {/* TODO Implement content */}
      </div>
    </>
  );
};