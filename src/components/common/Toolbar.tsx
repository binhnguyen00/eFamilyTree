import React from "react";
import classNames from "classnames";

interface ToolbarProps {
  children: React.ReactNode;
  boxShadow?: boolean;
  glass?: boolean;
}
export function Toolbar(props: ToolbarProps) {
  const { children, boxShadow = true, glass = true } = props;

  return (
    <div 
      className={classNames(
        "absolute bottom-6 left-1/2 -translate-x-1/2 rounded p-3 scroll-h", 
        {
          "shadow-lg": boxShadow,
          "bg-white/10 backdrop-blur-md": glass,
        })
      }
      style={{ 
        zIndex: 999,
        width: "95vw"
      }}
    >
      {children}
    </div>
  )
}