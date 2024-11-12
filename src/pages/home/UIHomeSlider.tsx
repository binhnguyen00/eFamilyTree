import React from "react";

import { Stack, Swiper, Text } from "zmp-ui";

import slide_01 from "assets/img/about-swiper-1.jpg";
import slide_02 from "assets/img/about-swiper-2.jpg";

export function UIHomeSlider() {
  return (
    <Stack space="0.5rem">
      <Text.Title> {"Album"} </Text.Title>
      <Swiper loop>
        <Swiper.Slide>
          <img
            className="slide-img"
            src={slide_01}
            alt="slide-1"
          />
        </Swiper.Slide>
        <Swiper.Slide>
          <img
            className="slide-img"
            src={slide_02}
            alt="slide-2"
          />
        </Swiper.Slide>
      </Swiper>
    </Stack>
  )
}