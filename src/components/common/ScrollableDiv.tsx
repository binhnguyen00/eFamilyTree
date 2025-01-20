import React from "react";

interface ScrollableDivProps {
  children: React.ReactNode;
  width?: number | string | "auto";
  height?: number | string | "auto";
  direction?: "horizontal" | "vertical" | "both";
  className?: string;
}

export function ScrollableDiv(props: ScrollableDivProps) {
  let { width = "auto", height = "auto", direction = "horizontal", children, className } = props; 

  const getScrollStyles = (direction: "horizontal" | "vertical" | "both") => {
    switch (direction) {
      case 'vertical':
        return { overflowY: 'auto', overflowX: 'hidden' };
      case 'horizontal':
        return { overflowX: 'auto', overflowY: 'hidden' };
      default:
        return { overflowX: 'auto', overflowY: 'auto' };
    }
  };

  const scrollableStyle = {
    width: width,
    height: height,
    ...getScrollStyles(direction),
  } as React.CSSProperties;

  return (
    <div 
      style={scrollableStyle}
      className={`${className ? className : ''}`}
    >
      {children}
    </div>
  )
}