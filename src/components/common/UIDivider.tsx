import React from "react";
import { Box } from "zmp-ui";
import { BoxProps } from "zmp-ui/box";

interface UIDividerProps extends BoxProps {
  size?: number;
  className?: string;
}
export default function UIDivider(props: UIDividerProps) {
  let { size = 1 } = props;
  
  return (
    <Box 
      style={{
        minHeight: size,
        opacity: 0.2,
        backgroundColor: "black",
      }}
      {...props}
    />
  )
}