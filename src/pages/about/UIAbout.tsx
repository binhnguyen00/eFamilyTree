import React from "react";
import { t } from "i18next";
import { Stack, Text, Swiper, Grid } from "zmp-ui";

import { Header, ImageWithText } from "components";

import slide_01 from "assets/img/about/about-swiper-1.jpg";
import slide_02 from "assets/img/about/about-swiper-2.jpg";
import people from "assets/img/about/people.png";
import scroll from "assets/img/about/scroll.png";
import vietnam from "assets/img/about/vietnam.png";

export function UIAbout() {
  return (
    <div className="container">
      <Header title={t("about")}/>

      <Stack space="1rem">

        <Swiper loop>
          <Swiper.Slide>
            <ImageWithText
              text={
                <Stack space="1rem" className="text-shadow charmonman-regular">
                  <p> {"Tự hào và Hãnh diện"} </p>
                  <p> {"Đồng hành cùng khách hàng"} </p>
                </Stack>
              }
              textStyle={{ fontSize: "1.6rem" }}
              src={slide_01}
              height={160}
            />
          </Swiper.Slide>
          <Swiper.Slide>
            <ImageWithText
              text={
                <Stack space="1rem" className="text-shadow charmonman-regular">
                  <p> {"Cùng Việt Nam"} </p>
                  <p> {"Chuyển đổi số"} </p>
                </Stack>
              }
              textStyle={{ fontSize: "2rem" }}
              src={slide_02}
              height={160}
            />
          </Swiper.Slide>
        </Swiper>
        
        <Stack space="1rem">
          <Text.Title size="xLarge" className="charmonman-regular text-shadow"> {"Gìn Giữ Giá Trị Gia Tộc"} </Text.Title>
          <Text> {"Ứng dụng kết nối dòng họ Việt Nam, với sứ mệnh gìn giữ và bảo tồn nét văn hóa dòng họ truyền thống."} </Text>
        </Stack>

        <Stack space="1rem">
          <Text.Title size="xLarge" className="charmonman-regular text-shadow"> {"Công Nghệ Lưu Giữ Giá Trị Truyền Thống"} </Text.Title>
          <Text> {"Ra đời với mong muốn áp dụng công nghệ hiện đại vào việc bảo tồn giá trị truyền thống quý báu, mang lại lợi ích thiết thực cho các dòng họ Việt."} </Text>
        </Stack>

        <Stack space="1rem">
          <Text.Title size="xLarge" className="charmonman-regular text-shadow"> {"Kết Nối Dòng Họ Từ Cây Gia Phả"} </Text.Title>
          <Text> {"Dựa trên nền tảng cây gia phả, ứng dụng giúp kết nối các thành viên trong dòng họ, hỗ trợ anh em, họ hàng duy trì tình cảm gắn bó, chia sẻ và giúp đỡ lẫn nhau."} </Text>
        </Stack>

        <Grid columnCount={3}>
          <Stack space="1rem" className="center">
            <img src={scroll} alt="dòng họ" style={{ width: 50, height: 50 }}/>
            <div>
              <Text.Title size="large"> {"23"} </Text.Title>
              <Text.Title className="charmonman-regular" size="large"> {"Dòng Họ"} </Text.Title>
            </div>
          </Stack>
          <Stack space="1rem" className="center">
            <img src={people} alt="dòng họ" style={{ width: 50, height: 50 }}/>
            <div>
              <Text.Title size="large"> {"1856"} </Text.Title>
              <Text.Title className="charmonman-regular" size="large"> {"Người dùng"} </Text.Title>
            </div>
          </Stack>
          <Stack space="1rem" className="center">
            <img src={vietnam} alt="dòng họ" style={{ width: 60, height: 50 }}/>
            <div>
              <Text.Title size="large"> {"15"} </Text.Title>
              <Text.Title className="charmonman-regular" size="large"> {"Tỉnh Thành"} </Text.Title>
            </div>
          </Stack>
        </Grid>

      </Stack>
    </div>
  );
};