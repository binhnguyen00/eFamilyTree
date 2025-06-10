import React from "react";

interface ToolbarProps {
  children: React.ReactNode;
}
export function Toolbar(props: ToolbarProps) {
  const { children } = props;

  return (
    <div className="absolute center bottom-12 flex-h scroll-h" style={{ zIndex: 999, width: "-webkit-fill-available" }}>
      {children}
    </div>
  )
}