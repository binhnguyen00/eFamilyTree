import React from "react";
import ReactDOMClient from "react-dom/client";

import { BotToTopPanel } from "./BotToTopPanel";

let activePanels: string[] = []; // Track active panels

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  header: string | React.ReactNode;
  height?: number;
  width?: number;
  close?: () => void;
}

export enum SlidingPanelOrient {
  LeftToRight = "ltr",
  RightToLeft = "rtl",
  TopToBottom = "ttb",
  BottomToTop = "btt",
}

interface SlidingPanelProps extends PanelProps {
  orient: SlidingPanelOrient;
}
export function SlidingPanel(props: SlidingPanelProps) {
  const { visible, height, children, header, close, orient, className } = props;

  const randomId = () => Math.random().toString(36).substring(2, 9);
  const ID = `sliding-panel-${randomId()}`;

  const renderPanelByOrient = () => {
    switch (orient) {
      case SlidingPanelOrient.LeftToRight:
        return (
          <BotToTopPanel className={className ? className : ""} header={header} visible={visible} height={height} close={close} >
            {children}
          </BotToTopPanel>
        );
      case SlidingPanelOrient.RightToLeft:
        return (
          <BotToTopPanel className={className ? className : ""} header={header} visible={visible} height={height} close={close} >
            {children}
          </BotToTopPanel>
        );
      case SlidingPanelOrient.TopToBottom:
        return (
          <BotToTopPanel className={className ? className : ""} header={header} visible={visible} height={height} close={close} >
            {children}
          </BotToTopPanel>
        );
      case SlidingPanelOrient.BottomToTop:
        return (
          <BotToTopPanel className={className ? className : ""} header={header} visible={visible} height={height} close={close} >
            {children}
          </BotToTopPanel>
        );
    }
  }

  React.useEffect(() => {
    if (!visible) return; // Only create the panel when visible is true

    const panel = document.createElement("div");
    panel.setAttribute("id", ID);
    document.body.appendChild(panel);

    const root = ReactDOMClient.createRoot(panel);
    root.render(
      renderPanelByOrient()
    );

    activePanels.push(ID);

    return () => {
      root.unmount();
      document.body.removeChild(panel);
      activePanels = activePanels.filter((panelId) => panelId !== ID);
    };
  }, [ visible ]);

  return null;
}