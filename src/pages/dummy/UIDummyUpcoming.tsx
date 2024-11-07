import React from "react";
import { t } from "i18next";
import { Button, Grid, Stack, Text } from "zmp-ui";

import { FcRating, FcStackOfPhotos } from "react-icons/fc";

import { CommonComponentUtils } from "../../utils/CommonComponentUtils";

export function UIDummyUpcoming() {
  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("upcoming"))}

      <Grid style={{ padding: "0 1rem" }} columnSpace="1rem" rowSpace="1rem" columnCount={2}>
        <Stack space="0.5rem">
          <Button
            variant="tertiary" 
            className="box-shadow"
            style={{
              height: 120,
              borderRadius: 30,
            }}
          >
            <FcRating size={"3rem"}/>
          </Button>
          <Text.Title 
            style={{ fontWeight: "bold", textAlign: "center", textTransform: "capitalize" }}
          > 
            {t("hall_of_fame")} 
          </Text.Title>
        </Stack>

        <Stack space="0.5rem">
          <Button
            variant="tertiary" 
            className="box-shadow"
            style={{
              height: 120,
              borderRadius: 30,
            }}
          >
            <FcStackOfPhotos size={"3rem"}/>
          </Button>
          <Text.Title 
            style={{ fontWeight: "bold", textAlign: "center", textTransform: "capitalize" }}
          > 
            {t("album")} 
          </Text.Title>
        </Stack>
      </Grid>
    </div>
  )
}