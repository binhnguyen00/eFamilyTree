import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { Box, Button, Modal } from "zmp-ui";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { Node } from "../../components/tree/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { processServerData } from "../family-tree/FamilyTreeUtils";

import rootNode from "../family-tree/member.json";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function UIDummyTree() {
  const members = processServerData(rootNode["employee_tree"] as any);
  const [ nodes, setNodes ] = React.useState(members);
  const [ rootId, setRootId ] = React.useState(nodes[0].id);
  const [ selectId, setSelectId ] = React.useState<string>("");

  return (
    <>
      {CommonComponentUtils.renderHeader("Demo Tree")}

      {nodes.length > 0 ? (
        <React.Fragment>
          <TransformWrapper
            centerOnInit
            initialPositionX={0}
            initialPositionY={0}
            minScale={0.01}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <React.Fragment>
                <UITreeControl />
                <TransformComponent>
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
                </TransformComponent>
              </React.Fragment>
            )}
          </TransformWrapper>

          <Modal
            visible={selectId !== ""}
            title={"Test Modal"}
            onClose={() => { setSelectId("") }}
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
      <Button size="small" onClick={() => { centerView() }}>
        {"Center"}
      </Button>
      <Button size="small" onClick={() => { resetTransform() }}>
        {"Reset"}
      </Button>
    </Box>
  )
}

export function getNodeStyle({ left, top }: Readonly<any>): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}