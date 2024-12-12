import React from "react";
import { Box } from "zmp-ui";
import { BoxProps } from "zmp-ui/box";

interface UIDividerProps extends BoxProps {
  size?: number;
  className?: string;
}
export function Divider(props: UIDividerProps) {
  let { size = 1 } = props;
  
  return (
    <Box 
      style={{
        minHeight: size,
        opacity: 1,
      }}
      {...props}
      className="bg-secondary mt-3 mb-3"
    />
  )
}