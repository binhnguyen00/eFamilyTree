import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { Node } from "../../components/tree/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { FamilyMember, processServerData } from "./FamilyTreeUtils";
import { Box, Button, Modal, Page, Stack, Text } from "zmp-ui";
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
    <Page className="section-container">
      {CommonComponentUtils.renderHeader("Family Tree")}

      {familyMembers.length > 0 ? (
        <div style={{ height: "100%" }}>
          <TransformWrapper centerOnInit minScale={0.01}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <Box flex flexDirection="column" justifyContent="space-between">
                <TransformComponent>
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
                </TransformComponent>
                <UITreeControl />
              </Box>
            )}
          </TransformWrapper>

          <Modal 
            visible={selectId !== ""}
            onClose={() => { setSelectId(""); }}
            actions={[ { text: "Close", close: true } ]}
          >
            <NodeDetails nodeId={selectId}/>
          </Modal>

        </div>
      ) : (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </Page>
  )
}

function UITreeControl() {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <Box flex flexDirection="row" justifyContent="space-between">
      <Button size="small" onClick={() => zoomIn()}>
        {"+ Zoom"}
      </Button>
      <Button size="small" onClick={() => zoomOut()}>
        {"- Zoom"}
      </Button>
      <Button size="small" onClick={() => { centerView()}}>
        {"Center"}
      </Button>
      <Button size="small" onClick={() => { resetTransform()}}>
        {"Reset"}
      </Button>
    </Box>
  )
}

function calculatePositionStyle({ left, top }: any): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}