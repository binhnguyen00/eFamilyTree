import React from "react";
import { t } from "i18next";
import { Box, Button, Stack, Swiper, Text } from "zmp-ui";

import { ImageWithText } from "components";

import banner_01 from "assets/img/banner/banner-01.jpg";
import banner_02 from "assets/img/banner/banner-02.jpg";
import banner_03 from "assets/img/banner/banner-03.jpg";
import banner_04 from "assets/img/banner/banner-04.jpg";
import { useRouteNavigate } from "hooks";

export function UIHomeBanner() {
  const { goTo } = useRouteNavigate();

  const onRegister = () => goTo("register");
  const onRegisterClan = () => goTo("register/clan");
  const navigateAbout = () => goTo("about");

  return (
    <Stack space="0.5rem">
      <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("family_tree")} </Text.Title>
      <Swiper>
        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <Stack space="1rem">
                  <p>{t("share_to")}</p>
                  <p>{t("love_ones")}</p>
                  <Box flex flexDirection="row" justifyContent="center" className="box-shadow">
                    <Button variant="primary" size="small" onClick={onRegister}>  {t("register")} </Button>
                  </Box>
                </Stack>
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
                <Stack space="1rem">
                  <p>{t("preserve_value")}</p>
                  <p>{t("house")}</p>
                  <Box flex flexDirection="row" justifyContent="center" className="box-shadow">
                    <Button variant="primary" size="small" onClick={onRegisterClan}>  {t("register_clan")} </Button>
                  </Box>
                </Stack>
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
                <Stack space="1rem">

                  <p>{t("maintain_technology")}</p>
                  <p>{t("traditional_value")}</p>
                  <Box flex flexDirection="row" justifyContent="center" className="box-shadow">
                    <Button variant="primary" size="small" onClick={navigateAbout}>  {t("about")} </Button>
                  </Box>
                </Stack>
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
                <Stack space="1rem">
                  <p> {t("connect_clan")} </p>
                </Stack>
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