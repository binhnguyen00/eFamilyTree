import React from "react";
import ReactFamilyTree from 'react-family-tree';

import { Node } from "../../components/tree/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { FamilyMember, processServerData } from "./FamilyTreeUtils";
import { Modal } from "zmp-ui";

const NODE_WIDTH = 70;
const NODE_HEIGHT = 80;

export function UIFamilyTree() {
  const [ reload, setReload ] = React.useState(false);
  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>("");

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) {
        let result: FamilyMember[] = processServerData(data);
        setFamilyMembers(result);
        setRootId(`${data.id}`);
      }
    }
    EFamilyTreeApi.getMembers(import.meta.env.VITE_DEV_PHONE_NUMBER as string, success);
  }, [ reload ]);

  return (
    <React.Fragment>
      {CommonComponentUtils.renderHeader("Family Tree")}

      {familyMembers.length > 0 ? (
        <React.Fragment>
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
              TESTTTTTT
            </div>
          </Modal>

        </React.Fragment>
      ) : (
        <div> Getting members... </div>
      )}
    </React.Fragment>
  )
}

export function getNodeStyle({ left, top }: any): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}