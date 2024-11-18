import React from "react";

interface SizedBoxProps {
  width: number | string;
  height: number | string;
  children?: React.ReactNode;
  borderRadius?: number;
  border?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event?: any) => void;
}
export default function SizedBox(props: SizedBoxProps) {
  const { width, height, children, className, style, onClick, border, borderRadius } = props;

  return (
    <div 
      className={`${className} ${border && "border"}`} 
      style={{
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: borderRadius ? "hidden" : undefined,
        borderRadius: borderRadius || "none",
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}