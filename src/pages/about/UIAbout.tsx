import React from "react";
import { t } from "i18next";
import { Stack, Text, Swiper, Grid } from "zmp-ui";

import slide_01 from "assets/img/about/about-swiper-1.jpg";
import slide_02 from "assets/img/about/about-swiper-2.jpg";
import people from "assets/img/about/people.png";
import scroll from "assets/img/about/scroll.png";
import vietnam from "assets/img/about/vietnam.png";

import UIHeader from "components/common/UIHeader";

function UIAbout() {
  return (
    <div className="container">
      <UIHeader title={t("about")} showBackIcon={false}/>

      <Stack space="1rem">

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
        
        <Stack space="1rem">
          <Text.Title size="large" className="charmonman-regular"> {"Gìn Giữ Giá Trị Gia Tộc"} </Text.Title>
          <Text> {"Ứng dụng kết nối dòng họ Việt Nam, với sứ mệnh gìn giữ và bảo tồn nét văn hóa dòng họ truyền thống."} </Text>
        </Stack>

        <Stack space="1rem">
          <Text.Title size="large" className="charmonman-regular"> {"Công Nghệ Lưu Giữ Giá Trị Truyền Thống"} </Text.Title>
          <Text> {"Ra đời với mong muốn áp dụng công nghệ hiện đại vào việc bảo tồn giá trị truyền thống quý báu, mang lại lợi ích thiết thực cho các dòng họ Việt."} </Text>
        </Stack>

        <Stack space="1rem">
          <Text.Title size="large" className="charmonman-regular"> {"Kết Nối Dòng Họ Từ Cây Gia Phả"} </Text.Title>
          <Text> {"Dựa trên nền tảng cây gia phả, ứng dụng giúp kết nối các thành viên trong dòng họ, hỗ trợ anh em, họ hàng duy trì tình cảm gắn bó, chia sẻ và giúp đỡ lẫn nhau."} </Text>
        </Stack>

        <br />
        <br />

        <Grid columnCount={3}>
          <Stack className="center">
            <img 
              src={scroll} alt="dòng họ"
              style={{
                height: "50%",
                width: "50%",
              }}
            />
            <Text.Title size="large"> {"23"} </Text.Title>
            <Text.Title size="large"> {"Dòng Họ"} </Text.Title>
          </Stack>
          <Stack className="center">
            <img 
              src={people} alt="người dùng"
              style={{
                height: "50%",
                width: "50%",
              }}
            />
            <Text.Title size="large"> {"1856"} </Text.Title>
            <Text.Title size="large"> {"Người dùng"} </Text.Title>
          </Stack>
          <Stack className="center">
            <img 
              src={vietnam} alt="Việt Nam"
              style={{
                height: "50%",
                width: "50%",
              }}
            />
            <Text.Title size="large"> {"15"} </Text.Title>
            <Text.Title size="large"> {"Tỉnh Thành"} </Text.Title>
          </Stack>
        </Grid>

      </Stack>
    </div>
  );
};

export default UIAbout;