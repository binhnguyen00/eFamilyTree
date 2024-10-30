import React from "react";
import ReactFamilyTree from 'react-family-tree';

import { Node } from "../../components/tree/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { testProcessServerData, processServerData } from "../family-tree/FamilyTreeUtils";

import rootNode from "../family-tree/member.json";
import { Modal } from "zmp-ui";

export const NODE_WIDTH = 70;
export const NODE_HEIGHT = 80;

export function UIDummyTree() {
  testProcessServerData(rootNode["employee_tree"] as any);
  const members = processServerData(rootNode["employee_tree"] as any);
  const [nodes, setNodes] = React.useState(members);
  const [rootId, setRootId] = React.useState(nodes[0].id);
  const [selectId, setSelectId] = React.useState<string>("");

  return (
    <>
      {CommonComponentUtils.renderHeader("Demo Tree")}

      {nodes.length > 0 ? (
        <React.Fragment>
          <div className="scrollable">
            <ReactFamilyTree
              nodes={nodes as any}
              rootId={rootId}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              renderNode={(node: Readonly<any>) => (
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

          <Modal
            visible={selectId !== ""}
            title={"Test Modal"}
            onClose={() => { setSelectId(""); }}
            actions={[
              {
                text: "Close",
                close: true,
                highLight: true,
              },
            ]}
          >
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, qui non ipsa a facilis et amet dolores vero consequuntur sequi.
            </div>
          </Modal>
        </React.Fragment>
      ): (
        <div> Getting members... </div>
      )}
    </>
  );
}

export function getNodeStyle({ left, top }: Readonly<any>): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}