import React from "react";
import { t } from "i18next";
import { Button, Swiper, Text } from "zmp-ui";

import { useRouteNavigate } from "hooks";
import { ImageWithText } from "components";

import banner_01 from "assets/img/banner/banner-01.jpg";
import banner_02 from "assets/img/banner/banner-02.jpg";
import banner_03 from "assets/img/banner/banner-03.jpg";
import banner_04 from "assets/img/banner/banner-04.jpg";

export function UIHomeBanner() {
  const { goTo } = useRouteNavigate();

  const onRegister = () => goTo({ path: "register" });
  const onRegisterClan = () => goTo({ path: "register/clan" });

  return (
    <div className="flex-v rounded">
      <Swiper loop autoplay className="box-shadow-secondary rounded">
        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <div className="flex-v center">
                  <p>{t("share_to")}</p>
                  <p>{t("love_ones")}</p>
                  <Button size="small" onClick={onRegister}>  {t("Đăng ký tài khoản")} </Button>
                </div>
              }
              textStyle={{ fontSize: "1.5rem" }}
              src={banner_04}
              height={200}
            />
          </React.Suspense>
        </Swiper.Slide>

        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <div className="flex-v center">
                  <p>{t("preserve_value")}</p>
                  <p>{t("house")}</p>
                  <Button size="small" onClick={onRegisterClan}> {t("register_clan")} </Button>
                </div>
              }
              textStyle={{ fontSize: "2rem" }}
              src={banner_01}
              height={200}
            />
          </React.Suspense>
        </Swiper.Slide>

        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <div className="flex-v center">
                  <p>{t("maintain_technology")}</p>
                  <p>{t("traditional_value")}</p>
                  {/* <Button size="small" onClick={navigateAbout}>  {t("about")} </Button> */}
                </div>
              }
              textStyle={{ fontSize: "1.5rem" }}
              src={banner_02}
              height={200}
            />
          </React.Suspense>
        </Swiper.Slide>

        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <div className="flex-v">
                  <p> {t("connect_clan")} </p>
                </div>
              }
              textStyle={{ fontSize: "2rem" }}
              src={banner_03}
              height={200}
            />
          </React.Suspense>
        </Swiper.Slide>

      </Swiper>
    </div>
  )
}