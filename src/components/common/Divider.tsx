import React from "react";
import { Box } from "zmp-ui";
import { BoxProps } from "zmp-ui/box";

interface UIDividerProps extends BoxProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}
export function Divider(props: UIDividerProps) {
  let { size = 1, className, style } = props;
  
  return (
    <Box 
      style={{
        minHeight: size,
        opacity: 1,
        ...style,
      }}
      {...props}
      className={`${className} bg-secondary mt-2 mb-2`.trim()}
    />
  )
}