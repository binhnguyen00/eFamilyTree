import React from "react";
import { t } from "i18next";
import { Button, Text, Stack, Grid } from "zmp-ui";

import { StyleUtils, ZmpSDK } from "utils";
import { TestApi } from "api";
import { useNotification, useAppContext, usePageContext, useOverlayContext } from "hooks";
import { Header, Loading, SizedBox, NewsPaperSkeleton, ScrollableDiv } from "components";

import { Theme } from "types/user-settings";
import { Module } from "types/app-context";
import { FailResponse, ServerResponse } from "types/server";

import themeBlue from "assets/img/theme/theme-blue.jpeg";

export function UIPlayground() {

  return (
    <>
      <Header title={t("playground")}/>

      <div className="container my-3">
        <ScrollableDiv direction="vertical" className="flex-v" height={StyleUtils.calComponentRemainingHeight(0)}>

          <UIOverlay/>

          <UILocationPermission/>

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

        </ScrollableDiv>
      </div>
    </>
  )
}

function UITheme() {
  const { settings, updateTheme } = useAppContext();

  const render = () => {
    const html = Object.values(Theme).map((theme) => {
      return (
        <div>
          <Button size="small" variant="secondary" onClick={() => updateTheme(theme)}>
            {theme}
          </Button>
        </div>
      )
    })
    return (
      <div className="scroll-h"> {html} </div>
    );
  }

  return render();
}

function UIToastButtons() {
  const { successToast, dangerToast, warningToast, infoToast } = useNotification();
  return (
    <Grid columnCount={2} columnSpace="1rem" rowSpace="1rem">
      <Button size="small" variant="secondary" onClick={() => successToast("success")}> 
        Success Toast
      </Button>
      <Button size="small" variant="secondary" onClick={() => dangerToast("danger")}> 
        Danger Toast
      </Button>
      <Button size="small" variant="secondary" onClick={() => warningToast("warning")}>  
        Warning Toast
      </Button>
      <Button size="small" variant="secondary" onClick={() => infoToast("warning")}>  
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

function UILocationPermission() {
  const getLocation = () => {
    const success = (location: any) => {
      console.log(location);
    } 
    const fail = (error: any) => {
      console.log(error);
    }
    ZmpSDK.getLocation({ successCB: success, failCB: fail });
  }

  return (
    <Button variant="secondary" size="small" onClick={getLocation}>
      Get Location
    </Button>
  )
}

function UIOverlay() {
  const { open } = useOverlayContext();

  const onOpen = () => {
    open({
      title: "greeting",
      content: (
        <div>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam laudantium maxime quaerat numquam. Vitae ullam quasi incidunt sit modi fugit.
        </div>
      )
    })
  }

  return (
    <>
      <Button variant="secondary" size="small" onClick={onOpen}> {"Overlay"} </Button>
    </>
  )
}