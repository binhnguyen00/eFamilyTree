import React from "react";

interface SizedBoxProps {
  width: number | string;
  height: number | string;
  center?: boolean;
  children?: React.ReactNode;
  borderRadius?: number;
  border?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event?: any) => void;
}
export default function SizedBox(props: SizedBoxProps) {
  const { width, height, children, className, style, onClick, border, borderRadius, center } = props;
  const requireBorder = borderRadius || border;
  return (
    <div 
      className={`${className} ${border && "border"} ${center && "center"}`} 
      style={{
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: (requireBorder) ? "hidden" : undefined,
        borderRadius: (requireBorder) ? (borderRadius || 10) : "none",
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}