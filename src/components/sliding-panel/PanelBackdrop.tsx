import React from "react";

interface PanelBackdropProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  height?: number;
  close?: () => void;
}
export function PanelBackdrop(props: PanelBackdropProps) {
  let { children, visible, close } = props;
  let [ display, setDisplay ] = React.useState(visible);

  React.useEffect(() => {
    setDisplay(visible);
  }, [ visible ])

  const closeBackDrop = () => {
    setDisplay(false);
    if (close) close();
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 8887, // Lower zIndex than the panel
        display: display ? "block" : "none",
      }}
      onClick={closeBackDrop}
    >
      {children}
    </div>
  )
}