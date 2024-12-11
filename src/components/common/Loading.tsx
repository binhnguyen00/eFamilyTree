import React from "react";
import { t } from "i18next";
import { Spinner, Stack, Text } from "zmp-ui";
import { SizedBox } from "./SizedBox";

interface LoadingProps {
  message?: string
  size?: "small" | "normal" | "large"
}
export function Loading(props: LoadingProps) {
  let { message, size } = props;

  if (!message || !message.length) message = t("loading");

  let width = 0;
  if (!size) size = "normal";
  if (size === "small") width = 50;
  if (size === "normal") width = 100;
  if (size === "large") width = 150; 

  return (
    <div className="container center">
      <SizedBox width={width} height={width}>
        <Stack space="0.5rem">
          <Spinner visible/>
          <Text.Title 
            style={{
              textTransform: "capitalize",
            }} 
            size="small"
          > 
            {message} 
          </Text.Title>
        </Stack>
      </SizedBox>
    </div>
  )
}