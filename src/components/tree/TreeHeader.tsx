import React from "react";

import { ExtNode } from "components/tree-relatives/types";
import { useAppContext } from "hooks";
import { TreeConfig } from "./TreeConfig";
import { ImageWithText } from "components/common";

import roll from "assets/img/tree/roll.png";

export function TreeHeader({ rootNode }: { rootNode: ExtNode }) {
  const { userInfo } = useAppContext();
  if (!userInfo.clanName.length) return <></>;

  const { left } = rootNode as ExtNode;
  const width = TreeConfig.nodeWidth / 2;
  const shiftToCorrectPos = 
    (left * width) -
    (rootNode?.spouses.length 
      ? TreeConfig.headerWidth / 3 
      : TreeConfig.headerWidth / 2.5);

  return (
    <div 
      className='text-center'
      style={{
        zIndex: 9999,
        width: 680,
        height: TreeConfig.nodeHeight,
        transform: `translate(${shiftToCorrectPos}px, 20px)`
      }}
    >
      <ImageWithText 
        src={roll} text={userInfo.clanName}  
        textStyle={{ fontSize: "2.7rem" }}      
        width={TreeConfig.headerWidth} 
        height={TreeConfig.headerHeight}
      />
    </div>
  )
}