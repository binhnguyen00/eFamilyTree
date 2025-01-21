import React from "react";

import { t } from "i18next";
import { Button, Text, Stack, Grid } from "zmp-ui";

import { TestApi } from "api";
import { useNotification, useAppContext, usePageContext } from "hooks";
import { Header, Loading, SizedBox, SlidingPanel, SlidingPanelOrient, NewsPaperSkeleton } from "components";

import { Theme } from "types/user-settings";
import { Module } from "types/app-context";
import { FailResponse, ServerResponse } from "types/server";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

export function UIPlayground() {

  return (
    <Stack space="1rem" className="container">
      <Header title={t("playground")}/>

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