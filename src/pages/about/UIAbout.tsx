import React from "react";
import { t } from "i18next";
import { Text, Swiper, Button } from "zmp-ui";

import { getAppConfig } from "utils";
import { useOverlayContext, useRouteNavigate } from "hooks";

export function UIAbout() {
  return (
    <div className="flex-v">
      <Text.Title size="normal" className="text-center">
        {t("Chào mừng đến với")}
      </Text.Title>
      <Text.Title size="xLarge" className="text-center text-primary">
        {t("Gia Phả Lạc Hồng")}
      </Text.Title>

      <Swiper>
        <Swiper.Slide className="p-2">
          <UISlogan/>
        </Swiper.Slide>
        <Swiper.Slide className="p-2">
          <UIVision/>
        </Swiper.Slide>
        <Swiper.Slide className="p-2">
          <UIMission/>
        </Swiper.Slide>
        <Swiper.Slide className="p-2">
          <UIFoundation/>
        </Swiper.Slide>
      </Swiper>
    </div>
  )
};

function UISlogan() {
  const { jumpTo } = useRouteNavigate();
  const { close } = useOverlayContext();
  const ZALO_APP_ID = getAppConfig((config) => {
    return config.app.id;
  });

  const onRegisterClan = () => { 
    close();
    jumpTo({ path: `zapps/${ZALO_APP_ID}/register/clan` }); 
  }

  return (
    <div className="flex-v text-wrap" style={{ height: "100%" }}>
      <Text.Title className="text-capitalize text-primary text-center">
        <span> {t("Một sản phẩm của")} </span>
        <span style={{ color: "#004d99"}}>
          {t("Mobi")}
        </span>
        <span style={{ color: "#FF0000"}}>
          {t("Fone")}
        </span>
      </Text.Title>
      <ul className="flex-v flex-grow-0 " style={{ fontSize: "1rem" }}>
        <li> {t("Sản phẩm được làm ra với kim chỉ nam Kết nối cội nguồn - Gắn kết tương lai")} </li>
        <li> {t("Thương hiệu MobiFone uy tín, đảm bảo bảo mật dữ liệu")} </li>
        <li> {t("Nhân sự trải rộng tại các địa phương, nắm rõ đặc thù văn hoá, các hoạt động/sự kiện nội bật")} </li>
      </ul>
      <Button size="small" onClick={onRegisterClan}> {t("register_clan")} </Button>
    </div>
  );
}

function UIVision() {
  return (
    <div className="flex-v text-wrap " style={{ height: "100%" }}>
      <Text.Title className="text-capitalize text-primary text-center">
        {t("1. tầm nhìn")}
      </Text.Title>
      <ul className="flex-v flex-grow-0 " style={{ fontSize: "1rem" }}>
        <li> {t("TRỞ THÀNH HỆ SINH THÁI KẾT NỐI GIA ĐÌNH VIỆT")} </li>
        <li> 
          {t("Gia phả Lạc Hồng hướng tới trở thành hệ sinh thái toàn diện, không chỉ lưu giữ và phát triển hệ thống gia phả mà còn là trung tâm kết nối gia đình trong kỷ nguyên số.")}
        </li>
      </ul>
    </div>
  );
};

function UIMission() {
  return (
    <div className="flex-v text-wrap" style={{ height: "100%" }}>
      <Text.Title className="text-capitalize text-primary text-center">
        {t("2. sứ mệnh")}
      </Text.Title>
      <ul className="flex-v flex-grow-0 " style={{ fontSize: "1rem" }}>
        <li> {t("GIA ĐÌNH LÀ CỘI NGUỒN - DÒNG TỘC LÀ GỐC RỄ. KẾT NỐI ĐỂ YÊU THƯƠNG MÃI MÃI")} </li>
        <li> {t("Gia phả Lạc Hồng mang trong mình sứ mệnh gắn kết những gia đình “dòng máu Lạc Hồng”, gìn giữ và bảo tồn cội nguồn “4000 năm” đáng tự hào của hàng triệu trái tim người Việt Nam.")} </li>
        <li> {t("Gia phả Lạc Hồng là sứ giả kết nối quá khứ, hiện tại và tương lai, tôn vinh những giá trị văn hóa, lịch sử của dòng họ")} </li>
      </ul>
    </div>
  );
};

function UIFoundation() {
  return (
    <div className="flex-v text-wrap" style={{ height: "100%" }}>
      <Text.Title className="text-capitalize center text-primary">
        {t("3. giá trị cốt lõi")}
      </Text.Title>
      <ul className="flex-v flex-grow-0 " style={{ fontSize: "1rem" }}>
        <li> {t("CÔNG NGHỆ ĐỂ KẾT NỐI CỘI NGUỒN, YÊU THƯƠNG")} </li>
        <li> {t("Gia Phả Lạc Hồng là cầu nối gắn kết yêu thương giữa các thế hệ trong gia đình và dòng tộc, vượt qua ranh giới về địa lý và thời gian.")} </li>
        <li> {t("Với nền tảng công nghệ tiên tiến, việc tạo, cập nhật và chia sẻ thông tin gia phả trở nên dễ dàng, giúp mọi thế hệ trong gia đình tiếp cận một cách thuận tiện và nhanh chóng.")} </li>
      </ul>
    </div>
  );
};
