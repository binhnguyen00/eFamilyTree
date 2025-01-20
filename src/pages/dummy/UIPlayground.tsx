import React from "react";
import Handlebars from "handlebars";
import DOMPurify from "dompurify";

import { t } from "i18next";
import { Button, Text, Stack, Grid } from "zmp-ui";

import { TestApi } from "api";
import { useNotification, useAppContext, usePageContext } from "hooks";
import { Header, Loading, SizedBox, SlidingPanel, SlidingPanelOrient, NewsPaperSkeleton, ScrollableDiv } from "components";

import { Theme } from "types/user-settings";
import { Module } from "types/app-context";
import { FailResponse, ServerResponse } from "types/server";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";
import petitionLetter from "assets/template/petition-letter.hbs?raw";

export function UIPlayground() {

  return (
    <Stack space="1rem" className="container">
      <Header title={t("playground")}/>

      <UIPetitionLetter/>

      <UISkeletonLoading/>

      <UIToastButtons/>

      <Stack space="1rem">
        <Text.Title size="large"> {"Mock CORS"} </Text.Title>
        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => {
            console.log(result);
          } 
          const fail = (error: FailResponse) => {
            console.error(error);
          }
          TestApi.mockHTTP(success, fail);
        }}>
          {"HTTP"}
        </Button>
      </Stack>

      <UITheme/>

      <Loading/>

      <UISlidePanel/>

    </Stack>
  )
}

function UITheme() {
  const { settings, updateSettings } = useAppContext();

  return (
    <Stack space="1rem">
      <Text.Title size="large" className="text-capitalize"> {t("theme")} </Text.Title>
      <div className="scroll-h flex-h">

        <Stack space="0.5rem" className="center text-capitalize">
          <SizedBox 
            className="button"
            width={150} 
            height={100} 
            border
            onClick={() => {
              updateSettings({
                ...settings,
                theme: Theme.DEFAULT
              })
            }}
          >
            <img src={themeRed} alt="theme red"/>
          </SizedBox>
          <Text> {t("theme_red")} </Text>
        </Stack>

        <Stack space="0.5rem" className="center text-capitalize">
          <SizedBox 
            className="button"
            width={150} 
            height={100} 
            border
            onClick={() => {
              updateSettings({
                ...settings,
                theme: Theme.BLUE
              })
            }}
          >
            <img src={themeBlue} alt="theme blue"/>
          </SizedBox>
          <Text> {t("theme_blue")} </Text>
        </Stack>
      </div>
    </Stack>
  )
}

function UISlidePanel() {
  let [ visible, setVisible ] = React.useState(false); 
  return (
    <>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        {t("sliding panel")}
      </Button>
      <SlidingPanel 
        header={<p style={{ fontSize: "large" }}> Header </p>} 
        visible={visible} 
        height={550}
        orient={SlidingPanelOrient.BottomToTop}
        close={() => setVisible(false)}
      >
        <div>
          This is Content
        </div>
      </SlidingPanel>
    </>
  )
}

function UIToastButtons() {
  const { successToast, dangerToast, warningToast, infoToast } = useNotification();
  return (
    <Grid columnCount={2} columnSpace="1rem" rowSpace="1rem">
      <Button variant="secondary" onClick={() => successToast("success")}> 
        Success Toast
      </Button>
      <Button variant="secondary" onClick={() => dangerToast("danger")}> 
        Danger Toast
      </Button>
      <Button variant="secondary" onClick={() => warningToast("warning")}>  
        Warning Toast
      </Button>
      <Button variant="secondary" onClick={() => infoToast("warning")}>  
        Info Toast
      </Button>
    </Grid>
  )
}

function UIPermissionButtons() {
  const { canRead, canWrite, canModerate, canAdmin } = usePageContext(Module.THEME);
  console.table({ canRead, canWrite, canModerate, canAdmin });
  return (
    <></>
  )
}

function UISkeletonLoading() {
  const [ loading, setLoading ] = React.useState(true);

  return (
    <div className="flex-v">
      <Button size="small" variant="secondary" onClick={() => setLoading(!loading)}> {"Skeleton Loading"} </Button>
      <NewsPaperSkeleton 
        loading={loading} 
        content={
          <div className="flex-v"> 
            <img className="rounded" src={themeBlue} style={{ height: 100, width: "100%" }}/>
            <p className="bold"> Lorem ipsum dolor sit amet. </p>
            <div>
              <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
              <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
              <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
            </div>
          </div>
        }
      />
    </div>
  )
}

function UIPetitionLetter() {
  Handlebars.registerHelper('textVertical', function(text) {
    return text.split(' ').map(function(word) {
      if (word === "/") return `<br/>`;
      return `<p>${word}</p>`;
    }).join('');
  });
  
  const compiledTemplate = Handlebars.compile(petitionLetter);
  const filledTemplate = compiledTemplate({
    col1: "/ Khích Thiết Bình Doanh Chi Phí Cẩn Sơ",
    col2: "/ Vô Xâm Phạm Chi Ngu Bách Phúc Thiên Tường Thưởng Hưởng Thọ Khang Chi Khánh Nhất Thiết Sở Cầu Vạn Ban Như Ý Đàn Thần Hạ Tình Vô Nhậm",
    col3: "Đức Đại Khuông Phù Ân Hoàng Tế Độ Dáng Phúc Lưu Ân Trừ Tai Xá Quá Tỉ Thần Đẳng Gia Môn Hanh Thái Bản Mệnh Bình An Tam Tai Bát Nam",
    col4: "Hồng Từ / / / / / / Đồng Thuỳ / / / / / / Chiếu Giám / / / / / / / Phục Nguyện",
    col5: "/ Bản Điện Phụng Tự Nhất Thiết Uy Linh / / / / / / / / / / / / / / / / Vị Tiền Cung Vọng",
    col6: "Tam Toà Vương Mẫu Ngũ Vị HOàng Thái Tử Vương Quan Khàm Sai Công Chúa / / / / / / / / / / Cung Quyết Hạ",
    col7: "Tam Giới Thiên Chúa Tứ Phủ Vạn Linh Công Đồng Đại Đế / / / / / / / / / / / / / Ngọc Bệ Hạ",
    col8: "Nam Mô Thập Phương Tam Bảo Chư Đại Bồ Tát / / / / / / / / / / / / / / / Kim Liên Toạ Hạ",
    col9: "/ Tứ Thiết Kim Ngàn Hương Hoa Lễ Vật Tịnh Cúng Phu Trần Cụ Hữu Sớ Văn Kiền Thân / / Thượng Tẩu / / Cung Duy",
    col10: "Phật Thánh Khuông Phù Chỉ Đức Tư Phùng Lệnh Tiết / Tiến Lễ Cờ An Giản Nhất Thiết Chi Tai Ương Cờ Vạn Ban Chi Cát Khánh Do Thị Kim Nguyệt",
    col11: "Ngọc Bệ Phủ Giám PHàm Tâm Ngôn Niệm Thần Đẳng Sinh Cư Dương Thể Số Hệ / / Thiên Cung Hạ Càn Khỏn Phủ Tái Chi Ân Cảm",
    col12: "",
  });


  const purified = DOMPurify.sanitize(filledTemplate);
  return (
    <>
      <Text.Title> {t("Handlebar Template")} </Text.Title>
      <ScrollableDiv className="bg-secondary" direction="both" height={500}>
        <div
          dangerouslySetInnerHTML={{ __html: purified }}
          className="text-base"
        />
      </ScrollableDiv>
    </>
  );
}