import React from "react";

import { t } from "i18next";
import { Button, Text, Stack, Grid } from "zmp-ui";

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

      <UIUserSetting/>

      <UIUploadImageFile/>

      <UITheme/>

      {/* <Loading/> */}

      <UISlidePanel/>

    </Stack>
  )
}

function UIUserSetting() {
  const { settings, updateSettings } = useAppContext();

  return (
    <Stack space="1rem">
      <Text.Title size="large" className="text-capitalize"> {t("setting")} </Text.Title>
      <Grid columnCount={2} columnSpace="0.5rem" rowSpace="0.5rem">

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { console.log(result); } 
          const fail = (error: FailResponse) => { console.error(error); }
          TestApi.getDefault(success, fail);
        }}>
          {"Get Default"}
        </Button>

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { console.log(result); } 
          const fail = (error: FailResponse) => { console.error(error); }
          TestApi.getOrDefault("0942659016", success, fail);
        }}>
          {"Get Settings"}
        </Button>

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { updateSettings({
            ...settings,
            theme: result.data.theme,
            language: result.data.language,
          }) } 
          const fail = (error: FailResponse) => { console.error(error); }
          TestApi.updateOrCreate("0942659016", {
            language: settings.language,
            theme: "default",
          }, success, fail);
        }}>
          {"Default Theme"}
        </Button>

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { updateSettings({
            ...settings,
            theme: result.data.theme,
            language: result.data.language,
          }) } 
          const fail = (error: FailResponse) => { console.error(error); }
          TestApi.updateOrCreate("0942659016", {
            language: settings.language,
            theme: "blue",
          }, success, fail);
        }}>
          {"Blue Theme"}
        </Button>

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { updateSettings({
            ...settings,
            theme: result.data.theme,
            language: result.data.language,
          }) } 
          const fail = (error: FailResponse) => { console.error(error); }
          TestApi.updateOrCreate("0942659016", {
            theme: settings.theme,
            language: "vi",
          }, success, fail);
        }}>
          {t("vietnamese")}
        </Button>

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => { updateSettings({
            ...settings,
            theme: result.data.theme,
            language: result.data.language,
          }) } 
          const fail = (error: FailResponse) => { console.error(error); }
          TestApi.updateOrCreate("0942659016", {
            theme: settings.theme,
            language: "en",
          }, success, fail);
        }}>
          {t("english")}
        </Button>

        <Button variant="secondary" onClick={() => {
          const success = (result: ServerResponse) => {
            const bg = result.data;
            updateSettings({
              ...settings,
              background: {
                id: bg["id"],
                path: bg["path"]
              }
            })
          }
          TestApi.updateBackground("0942659016", undefined, success);
        }}>
          {t("reset_background")}
        </Button>

      </Grid>
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

function UIUploadImageFile() {
  let { settings, updateSettings } = useAppContext();

  const getImage = () => {
    const fileInput = (document.getElementById('ftree-bg') as HTMLInputElement).files?.[0];
    return fileInput || null;
  }

  const upload = (event: any) => {
    const image = getImage();
    console.log(image);
    if (!image) return;

    const success = (result: ServerResponse) => {
      const bg = result.data; 
      updateSettings({
        ...settings,
        background: {
          id: bg["id"],
          path: bg["path"]
        }
      })
    }
    const fail = (error: FailResponse) => {
      console.error(error);
    }
    TestApi.updateBackground("0942659016", image, success, fail);
  }

  const get = () => {
    const success = (result: ServerResponse) => {
      console.log(result.data);
    }
    const fail = (error: FailResponse) => {
      console.error(error);
    }
    TestApi.getBackground("0942659016", success, fail);
  }

  return (
    <Stack space="1rem">
      <Text.Title size="large" className="text-capitalize"> {t("Change Tree Background")} </Text.Title>

      <input
        type="file"
        id="ftree-bg" accept="image/*"
      />

      <Grid columnCount={2} columnSpace="0.5rem">
        <Button variant="secondary" onClick={upload}> 
          upload 
        </Button>
        <Button variant="secondary" onClick={get}> 
          get
        </Button>
      </Grid>
    </Stack>
  )
}

function UISlidePanel() {
  let [ visible, setVisible ] = React.useState(false); 
  return (
    <>
      <Button variant="secondary" onClick={() => setVisible(true)}>
        {t("open")}
      </Button>
      <SlidingPanel 
        header={<p style={{ fontSize: "large" }}> Header </p>} 
        visible={visible} 
        orient={SlidingPanelOrient.BottomToTop}
        close={() => setVisible(false)}
      >
        <div>
          Test 1
        </div>
      </SlidingPanel>
    </>
  )
}