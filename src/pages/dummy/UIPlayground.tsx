import React from "react";
import { t } from "i18next";
import { Button, Text, Grid } from "zmp-ui";

import { ZmpSDK } from "utils";
import { Theme } from "types/user-settings";
import { Header, Loading, Retry, ScrollableDiv } from "components";
import { useNotification, useAppContext, usePageContext, useOverlayContext } from "hooks";

export function UIPlayground() {

  return (
    <>
      <Header title={t("playground")}/>

      <ScrollableDiv direction="vertical" className="flex-v container bg-white min-h-[100vh]">

        <UIOverlay/>

        <UILocationPermission/>

        <UIUserPermission/>

        <UIToastButtons/>

        <UITheme/>

        <div className="flex-v flex-grow-0 text-base">
          <Text.Title size="large"> {"Components"} </Text.Title>
          <Grid columnCount={2} columnSpace="1rem" rowSpace="1rem">
            <Loading/>
            <Retry title="Retry" onClick={() => {}}/>
          </Grid>
        </div>

      </ScrollableDiv>
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
      <div className="flex-v flex-grow-0 text-base">
        <Text.Title size="large"> {"Theme"} </Text.Title>
        <div className="scroll-h"> {html} </div>
      </div>
    );
  }

  return render();
}

function UIToastButtons() {
  const { successToast, dangerToast, warningToast, infoToast } = useNotification();
  return (
    <div className="flex-v flex-grow-0 text-base">
      <Text.Title size="large"> {"Toast"} </Text.Title>
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
    </div>
  )
}

function UIUserPermission() {
  const { canRead, canWrite, canModerate, canAdmin } = usePageContext();
  return (
    <div className="flex-v flex-grow-0 text-base">
      <Text.Title size="large"> {"Permission"} </Text.Title>
      <table>
        <tr>
          <td>Can Read</td>
          <td>{canRead ? "yes" : "no"}</td>
        </tr>
        <tr>
          <td>Can Write</td>
          <td>{canWrite ? "yes" : "no"}</td>
        </tr>
        <tr>
          <td>Can Moderate</td>
          <td>{canModerate ? "yes" : "no"}</td>
        </tr>
        <tr>
          <td>Can Admin</td>
          <td>{canAdmin ? "yes" : "no"}</td>
        </tr>
      </table>
    </div>
  )
}

function UILocationPermission() {
  const [ location, setLocation ] = React.useState<any>(null);

  const getLocation = () => {
    const success = (location: any) => {
      setLocation(location);
    } 
    const fail = (error: any) => {
      console.log(error);
    }
    ZmpSDK.getLocation({ successCB: success, failCB: fail });
  }

  return (
    <div className="flex-v flex-grow-0 text-base">
      <Text.Title size="large"> {"Location"} </Text.Title>
      <Text> {JSON.stringify(location)} </Text>
      <Button variant="secondary" size="small" onClick={getLocation}>
        Get Location
      </Button>
    </div>
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
    <div className="flex-v flex-grow-0 text-base">
      <Text.Title size="large"> {"Overlay"} </Text.Title>
      <Button variant="secondary" size="small" onClick={onOpen}> {"Overlay"} </Button>
    </div>
  )
}