import React from "react";
import { create } from 'pinch-zoom-pan';

import "../../css/pinch.scss";

interface PinchZoomPanProps {
  min?: number;
  max?: number;
  captureWheel?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const PinchZoomPan = React.memo(
  function PinchZoomPan({ min, max, captureWheel, className, style, children }: PinchZoomPanProps) {
    const root = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const element = root.current;
      if (!element) return;
      const canvas = create({ element, minZoom: min, maxZoom: max, captureWheel });
      return canvas.destroy;
    }, [min, max, captureWheel]);

    return (
      <div ref={root} className={`${className} pinch-root`} style={style}>
        <div className={"pinch-point"}>
          <div className={"pinch-canvas"}>
            {children}
          </div>
        </div>
      </div>
    );
  },
)