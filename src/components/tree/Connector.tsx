import React from "react";

import { Connector } from 'components/tree-relatives/types';

interface Props {
  connector: Connector;
  width: number;
  height: number;
}

export default React.memo<Props>(function Connector({ connector, width, height }) {
  const [x1, y1, x2, y2] = connector;

  return (
    <i
      className="tree-connector"
      style={{
        position: 'absolute',
        width: Math.max(1, (x2 - x1) * width + 1),
        height: Math.max(1, (y2 - y1) * height + 1),
        transform: `translate(${x1 * width}px, ${y1 * height}px)`,
        pointerEvents: 'none',
      }}
    />
  );
});