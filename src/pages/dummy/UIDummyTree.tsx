import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { BottomNavigation, Modal, Page } from "zmp-ui";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { Node } from "../../components/tree/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { FamilyTreeUtils as FTreeUtils } from "../family-tree/FamilyTreeUtils";

import rootNode from "../family-tree/member.json";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function UIDummyTree() {
  const members = FTreeUtils.processServerData(rootNode["employee_tree"] as any);
  const [ nodes, setNodes ] = React.useState(members);
  const [ rootId, setRootId ] = React.useState(nodes[0].id);
  const [ selectId, setSelectId ] = React.useState<string>("");

  return (
    <Page className="page section-container" style={{ overflow: "hidden" }}>
      {CommonComponentUtils.renderHeader("Dummy Tree")}

      {nodes.length > 0 ? (
        <>
          <TransformWrapper
            centerOnInit
            minScale={0.01}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent>
                  <ReactFamilyTree
                    nodes={nodes as any}
                    rootId={rootId}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    renderNode={(node: any) => (
                      <Node
                        key={node.id}
                        node={node}
                        isRoot={node.id === rootId}
                        onSelectNode={setSelectId}
                        style={calculatePositionStyle(node)}
                      />
                    )}
                  />
                </TransformComponent>
                <UITreeControl />
              </>
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
        </>
      ) : (
        <div> Getting members... </div>
      )}
    </Page>
  );
}

function UITreeControl() {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <BottomNavigation
      fixed
    >
      <BottomNavigation.Item
        key="zoomIn"
        label={"+ Zoom"}
        icon={<TiZoomInOutline/>}
        onClick={() => zoomIn()}
      />
      <BottomNavigation.Item
        key="zoomOut"
        label={"- Zoom"}
        icon={<TiZoomOutOutline />}
        onClick={() => zoomOut()}
      />
      <BottomNavigation.Item
        key="center"
        label={"Center"}
        icon={<BiHorizontalCenter/>}
        onClick={() => centerView()}
      />
      <BottomNavigation.Item
        key="reset"
        label={"Reset"}
        icon={<CgUndo/>}
        onClick={() => resetTransform()}
      />
    </BottomNavigation>
  )
}

export function calculatePositionStyle({ left, top }: Readonly<any>): React.CSSProperties {
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    transform: `translate(${left * (NODE_WIDTH / 2)}px, ${top * (NODE_HEIGHT / 2)}px)`,
  };
}