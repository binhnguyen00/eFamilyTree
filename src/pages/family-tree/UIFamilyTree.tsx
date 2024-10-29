import React from "react";
import { Box, Button, Grid, Modal, Page, Text } from "zmp-ui";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import ReactFamilyTree from 'react-family-tree';
import { ExtNode } from "relatives-tree/lib/types";
import { Node } from "components/tree/node/Node";
import { FamilyMember, processServerData } from "./FamilyTreeUtils";
import nodes from "./demo-member.json";

export const NODE_WIDTH = 70;
export const NODE_HEIGHT = 80;

export function UIFamilyTree() {
  console.log(nodes);
  
  const [ reload, setReload ] = React.useState(false);
  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>(nodes);
  const firstNodeId = React.useMemo(() => familyMembers[0].id, [familyMembers]);
  const [ rootId, setRootId ] = React.useState<string>(firstNodeId);
  const [ selectId, setSelectId ] = React.useState<string>();

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) {
        setRootId(data.id);
        const result = processServerData(data);
        console.log("Members", result);
        setFamilyMembers(result);
        setRootId(data.id);
      }
    }
    EFamilyTreeApi.getMembers(import.meta.env.VITE_DEV_PHONE_NUMBER as string, success);
  }, [ reload ]);

  return (
    <>
      {CommonComponentUtils.renderHeader("Family Tree")}

      <React.Fragment>
        {familyMembers.length > 0 ? (
          <div className="scrollable">
            <ReactFamilyTree
              nodes={nodes as any}
              rootId={rootId}
              height={NODE_HEIGHT}
              width={NODE_WIDTH}
              renderNode={(node: Readonly<ExtNode>) => (
                <Node
                  key={node.id}
                  node={node}
                  isRoot={node.id === rootId}
                  onClick={setSelectId}
                  style={getNodeStyle(node)}
                />
              )}
            />
          </div>
        ) : (
          <div> Getting members... </div>
        )}
      </React.Fragment>
    </>
  )
}

export function getNodeStyle({ left, top }: Readonly<ExtNode>): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}