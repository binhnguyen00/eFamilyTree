import React from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Box, Button, Stack, Swiper, Text } from "zmp-ui";
import { ImageWithText } from "components";

import banner_01 from "assets/img/banner/banner-01.jpg";
import banner_02 from "assets/img/banner/banner-02.jpg";
import banner_03 from "assets/img/banner/banner-03.jpg";
import banner_04 from "assets/img/banner/banner-04.jpg";

export function UIHomeBanner() {
  const navigate = useNavigate();

  const onRegister = () => {
    navigate("/register");
  }

  return (
    <Stack space="0.5rem">
      <Text.Title size="xLarge" className="text-capitalize text-shadow"> {t("family_tree")} </Text.Title>
      <Swiper>
        <Swiper.Slide>
          <React.Suspense>
            <ImageWithText 
              text={
                <Stack space="1rem">
                  <p>{"Lan toả tới"}</p>
                  <p>{"Những người yêu thương"}</p>
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
                  <p>{"Gìn Giữ Giá Trị"}</p>
                  <p>{"Gia Tộc"}</p>
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
                  <p>{"Công Nghệ Lưu Giữ"}</p>
                  <p>{"Giá Trị Truyền Thống"}</p>
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
                  <p> {"Kết Nối Dòng Họ"} </p>
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