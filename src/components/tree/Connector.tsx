import React from "react";

import { Connector } from 'components/tree-relatives/types';

interface Props {
  connector: Connector;
  width: number;
  height: number;
}

export default React.memo<Props>(function Connector({ connector, width, height }) {
  const [x1, y1, x2, y2] = connector;
  const thickness = 2;

  return (
    <i
      className="tree-connector"
      style={{
        position: 'absolute',
        width: Math.max(thickness, (x2 - x1) * width + 2),
        height: Math.max(thickness, (y2 - y1) * height + 1),
        transform: `translate(${x1 * width}px, ${y1 * height}px)`,
      }}
    />
  );
});
