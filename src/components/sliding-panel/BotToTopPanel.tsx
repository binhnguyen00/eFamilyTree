import React from "react";
import ReactDOM from "react-dom";
import { animated, useSpring } from "@react-spring/web";

import { PanelProps } from "./SlidingPanel";
import { PanelBackdrop } from "./PanelBackdrop";
import { PanelCloseButton } from "./PanelCloseButton";

export function BotToTopPanel(props: PanelProps) {
  const { children, height, visible, header, close } = props;
  const [ backdrop, setBackdrop ] = React.useState(visible);

  // Define animation
  const [ springs, api ] = useSpring(() => ({
    y: height, 
    opacity: 0,
    config: { tension: 120, friction: 15 },
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
      config: { tension: 220, friction: 15 },
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
          zIndex: 9999,
          ...springs,
        }}
        className={"rounded bg-secondary"}
      >
        <div className="text-primary">
          <PanelCloseButton close={reverseOpen}/>
          <div className="p-2 flex-v text-primary">
            <div className="text-center mb-2">
              {header}
            </div>
            {children}
          </div>
        </div>
      </animated.div>
    </>, document.body // Render as a portal
  );
}