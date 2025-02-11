import React from "react";
import { t } from "i18next";
import { Box, Button, Stack, Swiper, Text } from "zmp-ui";

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
  const navigateAbout = () => goTo({ path: "about" });

  return (
    <Stack space="0.5rem">
      <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("family_tree")} </Text.Title>
      <Swiper>
        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <div className="flex-v">
                  <p>{t("share_to")}</p>
                  <p>{t("love_ones")}</p>
                  {/* <Box flex flexDirection="row" justifyContent="center" className="box-shadow">
                    <Button variant="primary" size="small" onClick={onRegister}>  {`${t("register")} ${t("member")}`} </Button>
                  </Box> */}
                </div>
              }
              textStyle={{ fontSize: "1.5rem" }}
              src={banner_04}
              height={180}
            />
          </React.Suspense>
        </Swiper.Slide>

        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <div className="flex-v">
                  <p>{t("preserve_value")}</p>
                  <p>{t("house")}</p>
                  <Box flex flexDirection="row" justifyContent="center" className="box-shadow">
                    <Button variant="primary" size="small" onClick={onRegisterClan}>  {t("register_clan")} </Button>
                  </Box>
                </div>
              }
              textStyle={{ fontSize: "2rem" }}
              src={banner_01}
              height={180}
            />
          </React.Suspense>
        </Swiper.Slide>

        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <div className="flex-v">
                  <p>{t("maintain_technology")}</p>
                  <p>{t("traditional_value")}</p>
                  <Box flex flexDirection="row" justifyContent="center" className="box-shadow">
                    <Button variant="primary" size="small" onClick={navigateAbout}>  {t("about")} </Button>
                  </Box>
                </div>
              }
              textStyle={{ fontSize: "1.5rem" }}
              src={banner_02}
              height={180}
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
              height={180}
            />
          </React.Suspense>
        </Swiper.Slide>

      </Swiper>
    </Stack>
  )
}