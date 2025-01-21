import React from "react";
import ReactDOM from "react-dom";
import { animated, useSpring } from "@react-spring/web";

import { PanelProps } from "./SlidingPanel";
import { PanelBackdrop } from "./PanelBackdrop";
import { PanelCloseButton } from "./PanelCloseButton";

export function BotToTopPanel(props: PanelProps) {
  const { children, height, visible, header, close, className } = props;
  const [ backdrop, setBackdrop ] = React.useState(visible);

  // Define animation
  const [ springs, api ] = useSpring(() => ({
    y: height, 
    opacity: 0,
    config: { tension: 100, friction: 18 },
  }));

  const reverseOpen = () => {
    setBackdrop(false);
    if (close) {
      api.start({
        y: height,
        opacity: 0,
        onRest: close,
      });
    }
  };

  React.useEffect(() => {
    setBackdrop(visible); // Sync backdrop visibility with the panel
    api.start({
      y: visible ? 0 : height,
      opacity: visible ? 1 : 0,
      config: { tension: 100, friction: 18 },
    });
  }, [ visible, height ]);

  return ReactDOM.createPortal(
    <>
      {/* backdrop panel */}
      <PanelBackdrop visible={backdrop} close={reverseOpen}/>
      {/* actual panel */}
      <animated.div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: `${height ?  `${height}px` : "fit-content"}`,
          overflowY: "auto",
          zIndex: 8888,
          ...springs,
        }}
        className={`rounded-top bg-primary ${className ? className : ""}`}
      >
        <div className="text-secondary">
          <HeaderSection header={header} close={reverseOpen}/>
          <div className={`p-2 flex-v text-primary ${className ? className : ""}`}>
            {children}
          </div>
        </div>
      </animated.div>
    </>, document.body // Render as a portal
  );
}

interface HeaderSectionProps {
  header: string | React.ReactNode;
  close: () => void;
}
function HeaderSection(props: HeaderSectionProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 8888,
        height: "fit-content",
      }}
      className="bg-primary p-2 rounded-top"
    >
      <PanelCloseButton close={props.close}/>
      <div className="text-center mb-2">
        {props.header}
      </div>
    </div>
  )
}