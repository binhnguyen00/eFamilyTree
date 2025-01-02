import React from "react";

import { useConnection } from '@xyflow/react';

export default function ConnectionLine({ fromX, fromY, toX, toY }) {
  const { fromHandle } = useConnection();

  return (
    <g>
      <path
        fill="none"
        stroke={"#000"}
        strokeWidth={1.5}
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke={fromHandle?.id ?? '#000'}
        strokeWidth={1.5}
      />
    </g>
  );
};