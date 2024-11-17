import React from "react";

interface SizedBoxProps {
  width: number | string;
  height: number | string;
  content: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event?: any) => void;
}
export default function SizedBox(props: SizedBoxProps) {
  const { width, height, content, className, style, onClick } = props;

  return (
    <div 
      className={`${className}`} 
      style={{
        width: width,
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style
      }}
      onClick={onClick}
    >
      {content}
    </div>
  )
}