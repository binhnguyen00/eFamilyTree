import React from "react";
import { Box, Button, Grid, Modal, Page, Text } from "zmp-ui";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "utils/EFamilyTreeApi";
import ReactFamilyTree from 'react-family-tree';
import { ExtNode } from "relatives-tree/lib/types";
import { Node } from "components/tree/node/Node";

export const NODE_WIDTH = 70;
export const NODE_HEIGHT = 80;

export function UIFamilyTree() {
  return (
    <Page className="page">
      {CommonComponentUtils.renderHeader("Family Tree")}

      <UIFamilyTreeView/>
    </Page>
  )
}

interface IFamilyMember {
  id: number;
  name: string;
  parentId: boolean | any[];
  spouseData: null | { id: number, name: string, gioi_tinh: "nam" | "nu" }; // Dữ liệu vợ, chồng 
  gioi_tinh: "nam" | "nu";
  children?: IFamilyMember[];
}

export function UIFamilyTreeView() {
  const [ reload, setReload ] = React.useState(false);
  const [ ancestor, setAncestor ] = React.useState<IFamilyMember | null>(null);
  const [ rootId, setRootId ] = React.useState(null);
  const [ selectId, setSelectId ] = React.useState<string>();
  const [ hoverId, setHoverId ] = React.useState<string>();

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) {
        setAncestor(data);
        setRootId(data.id);
      }
    }
    EFamilyTreeApi.getMembers("0942659016", success);
  }, [ reload ]);

  return (
    <React.Fragment>
      {ancestor ? (
        <ReactFamilyTree
          nodes={[]}
          rootId=""
          height={1000}
          width={500}
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
      ): (
        <div> Getting members... </div>
      )}
    </React.Fragment>
  )
}

export function getNodeStyle({ left, top }: Readonly<ExtNode>): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}