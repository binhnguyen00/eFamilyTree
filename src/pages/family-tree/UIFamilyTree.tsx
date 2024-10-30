import React from "react";
import ReactFamilyTree from 'react-family-tree';

import { Node } from "../../components/tree/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { FamilyMember, processServerData } from "./FamilyTreeUtils";
import { Box, Button, Modal, Page, Text } from "zmp-ui";
import { NodeDetails } from "components/tree/node-details/NodeDetails";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

export function UIFamilyTree() {
  const [ reload, setReload ] = React.useState(false);
  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) {
        let result: FamilyMember[] = processServerData(data);
        setFamilyMembers(result);
        setRootId(`${data.id}`);
      }
    }
    const fail = (error: any) => {
      setFetchError(!fetchError);
    }
    // TODO: Replace with actual phone number. Use Provider.
    EFamilyTreeApi.getMembers(import.meta.env.VITE_DEV_PHONE_NUMBER as string, success, fail);
  }, [ reload, fetchError ]);

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
                  onClick={(id) => { setSelectId(id) }}
                  style={calculatePositionStyle(node)}
                />
              )}
            />
          </div>

          <Modal 
            visible={selectId !== ""}
            onClose={() => { setSelectId(""); }}
            actions={[ { text: "Close", close: true } ]}
          >
            <NodeDetails nodeId={selectId}/>
          </Modal>

        </React.Fragment>
      ) : (
        <Page className={"page"}>
            {fetchError ? (
              <Box flex flexDirection="column" justifyContent="center">
                <Text.Title>{"Something went wrong"}</Text.Title> 
                <Button onClick={() => setReload(!reload)}>{"Retry"}</Button>
              </Box>
            ) : (
              <Box flex justifyContent='center'> 
                <Text.Title>{"Getting members..."}</Text.Title> 
              </Box>
            )}
        </Page>
      )}
    </React.Fragment>
  )
}

function calculatePositionStyle({ left, top }: any): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}