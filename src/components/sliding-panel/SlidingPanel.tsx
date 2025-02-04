import React from "react";
import ReactDOMClient from "react-dom/client";

import { Divider } from "components";

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
            <Divider size={0}/>
          </BotToTopPanel>
        );
      case SlidingPanelOrient.RightToLeft:
        return (
          <BotToTopPanel className={className ? className : ""} header={header} visible={visible} height={height} close={close} >
            {children}
            <Divider size={0}/>
          </BotToTopPanel>
        );
      case SlidingPanelOrient.TopToBottom:
        return (
          <BotToTopPanel className={className ? className : ""} header={header} visible={visible} height={height} close={close} >
            {children}
            <Divider size={0}/>
          </BotToTopPanel>
        );
      case SlidingPanelOrient.BottomToTop:
        return (
          <BotToTopPanel className={className ? className : ""} header={header} visible={visible} height={height} close={close} >
            {children}
            <Divider size={0}/>
          </BotToTopPanel>
        );
    }
  }

  React.useEffect(() => {
    if (!visible) return; // Only create the panel when visible is true

    const appContainer = document.getElementById('app');
    if (!appContainer) {
      console.error('Container with id "app" not found.');
      return;
    }

    const panel = document.createElement("div");
    panel.setAttribute("id", ID);
    appContainer.appendChild(panel);

    const root = ReactDOMClient.createRoot(panel);
    root.render(
      renderPanelByOrient()
    );

    activePanels.push(ID);

    return () => {
      // Defer unmounting to avoid race conditions
      setTimeout(() => {
        root.unmount();
        if (panel.parentNode === appContainer) {
          appContainer.removeChild(panel);
        }
        activePanels = activePanels.filter((panelId) => panelId !== ID);
      }, 0); // 0ms delay ensures it runs after the current render
    };
  }, [ visible ]);

  return null;
}