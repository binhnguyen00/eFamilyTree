import React from "react";
import { toast, Flip } from "react-toastify";
import { t } from "i18next";
import { Button, Text, Stack } from "zmp-ui";

import { TestApi } from "api";
import { useAppContext } from "hooks";
import { Header, Loading, SizedBox, SlidingPanel, SlidingPanelOrient } from "components";
import { FailResponse, ServerResponse } from "server";

import themeRed from "assets/img/theme/theme-red.jpeg";
import themeBlue from "assets/img/theme/theme-blue.jpeg";

export function UIPlayground() {
  return (
    <Stack space="1rem" className="container">
      <Header title={t("playground")}/>

      <Button 
        variant="secondary" 
        onClick={() => toast("Wow so easy!", {
          autoClose: 3000,
          hideProgressBar: true,
          pauseOnFocusLoss: false,
          type: "success",
          transition: Flip,
          draggable: true,
          draggableDirection: "x"
        })}
      > 
        Toasty 
      </Button>

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
                theme: "default"
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
                theme: "blue"
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