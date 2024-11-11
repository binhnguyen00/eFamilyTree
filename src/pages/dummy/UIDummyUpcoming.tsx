import React from "react";
import { t } from "i18next";
import { Button, Grid, Stack, Text } from "zmp-ui";

import { FcRating } from "react-icons/fc";

import { CommonComponentUtils } from "../../components/common/CommonComponentUtils";

export default function UIDummyUpcoming() {
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
            <FcRating size={"4.5rem"}/>
          </Button>
          <Text.Title 
            style={{ fontWeight: "bold", textAlign: "center", textTransform: "capitalize" }}
          > 
            {t("hall_of_fame")} 
          </Text.Title>
        </Stack>
      </Grid>
    </div>
  )
}