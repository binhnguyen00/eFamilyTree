import React from "react";
import { t } from "i18next";

import { ExtNode } from "components/tree-relatives/types";
import { TreeConfig } from "./TreeConfig";
import { ImageWithText } from "components/common";

import roll from "assets/img/tree/roll.png";

export function TreeHeader({ rootNode, title }: { rootNode: ExtNode, title?: string }) {
  if (!title) return <></>;

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
        width: TreeConfig.headerWidth,
        height: TreeConfig.nodeHeight,
        transform: `translate(${shiftToCorrectPos}px, 20px)`
      }}
    >
      <ImageWithText 
        src={roll} text={`${t("clan")} ${title}`}  
        textStyle={{ fontSize: "2.7rem" }}      
        width={TreeConfig.headerWidth} 
        height={TreeConfig.headerHeight}
      />
    </div>
  )
}