import React from "react";
import { Box } from "zmp-ui";

interface UIDividerProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}
export function Divider(props: UIDividerProps) {
  const { size = 1, className, style } = props;
  
  return (
    <Box 
      style={{
        minHeight: size,
        opacity: 1,
        ...style,
      }}
      {...props}
      className={`${className} mt-2 mb-2`.trim()}
    />
  )
}