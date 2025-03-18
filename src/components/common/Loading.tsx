import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";
import { SizedBox } from "./SizedBox";
import { TailSpin } from "./TailSpin";

interface LoadingProps {
  message?: string
  size?: "small" | "normal" | "large"
  className?: string;
}
export function Loading(props: LoadingProps) {
  let { message, size, className } = props;

  if (!message || !message.length) message = t("loading");

  let width = 0;
  if (!size) size = "normal";
  if (size === "small") width = 50;
  if (size === "normal") width = 100;
  if (size === "large") width = 150; 

  return (
    <div className={`container center ${className && className}`.trim()}>
      <SizedBox width={width} height={width}>
        <div className="flex-v center">
          <TailSpin height={width / 4} width={width / 4}/>
          <Text.Title
            style={{
              textTransform: "capitalize",
            }} 
            size="small"
            className="text-base"
          > 
            {message} 
          </Text.Title>
        </div>
      </SizedBox>
    </div>
  )
}