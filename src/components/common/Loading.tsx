import React from "react";
import { Spinner, Text } from "zmp-ui";

interface UILoadingProps {
  message: string
  size?: "small" | "normal" | "large"
}
export default function UILoading(props: UILoadingProps) {
  let { message, size } = props;
  let width = 0;
  if (!size) size = "normal";
  if (size === "small") width = 50;
  if (size === "normal") width = 100;
  if (size === "large") width = 150; 

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      {/* TODO: implement size */}
      <div>
        <Spinner visible/>
      </div>
      <Text.Title style={{
        textTransform: "capitalize",
      }} size="small"> {message} </Text.Title>
    </div>
  )
}