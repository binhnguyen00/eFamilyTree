import React from "react";
import ReactFamilyTree from 'react-family-tree';

import { Node } from "../../components/tree/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { FamilyMember, processServerData } from "./FamilyTreeUtils";

const NODE_WIDTH = 70;
const NODE_HEIGHT = 80;

export function UIFamilyTree() {
  const [ reload, setReload ] = React.useState(false);
  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>(rootId);

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) {
        let result: FamilyMember[] = processServerData(data);
        setFamilyMembers(result);
        setRootId(`${data.id}-${data.name}`);
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
              nodes={familyMembers as any}
              rootId={rootId}
              height={NODE_HEIGHT}
              width={NODE_WIDTH}
              renderNode={(node: any) => (
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

export function getNodeStyle({ left, top }: any): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}