import React from "react";

interface SizedBoxProps {
  width: number | string;
  height: number | string;
  center?: boolean;
  children?: React.ReactNode;
  borderRadius?: number;
  border?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event?: any) => void;
}
export function SizedBox(props: SizedBoxProps) {
  let { 
    children, className, style, 
    width, height, 
    border, borderTop, borderBottom, borderRadius, 
    padding, paddingTop, paddingBottom,
    center,
    onClick, 
  } = props;

  if (center === null || center === undefined) center = true;
  if (center) {
    style = {
      ...style,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }
  }
  if (!padding) padding = 0;
  if (!paddingTop) paddingTop = padding;
  if (!paddingBottom) paddingBottom = padding;

  return (
    <div 
      className={`${className ? className : ""} ${border ? "border-primary" : ""}`.trim()} 
      style={{
        width: width,
        height: height,
        borderTop: (borderTop) ? "0.5px solid" : undefined,
        borderBottom: (borderBottom) ? "0.5px solid" : undefined,
        borderRadius: (border) ? (borderRadius !== undefined ? borderRadius : 10) : undefined,
        padding: `${padding}px`,
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        overflow: "hidden",
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}