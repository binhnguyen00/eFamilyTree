import React from "react";
import { t } from "i18next";
import FamilyTree from "../../components/tree/FamilyTree";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { BottomNavigation, Modal, Select } from "zmp-ui";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { Node } from "../../components/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponentUtils";

import average from "../family-tree/sample/average.json";
import divorced from "../family-tree/sample/divorced.json";
import severalSprouses from "../family-tree/sample/several-sprouses.json";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

export function UIDummyTree() {
  const dataSrcKey = {
    1: average,
    2: severalSprouses,
    3: divorced
  }
  const [ nodes, setNodes ] = React.useState<any[]>(average);
  const [ rootId, setRootId ] = React.useState(nodes[0].id);
  const [ selectId, setSelectId ] = React.useState<string>("");

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("dummy_tree"))}

      {nodes.length > 0 ? (
        <div style={{ height: "100%" }}>
          <Select
            label={t("data_source")}
            defaultValue="1"
            onChange={(val) => {
              const members = dataSrcKey[Number(val)];
              setNodes(members);
              setRootId(members[0].id); 
            }}
            closeOnSelect
          >
            <Select.Option value="1" title={t("average")} />
            <Select.Option value="2" title={t("several_sprouses")} />
            <Select.Option value="3" title={t("divorced")} />
          </Select>

          <TransformWrapper
            centerOnInit
            minScale={0.01}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent>
                  <FamilyTree
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
        </div>
      ) : (
        <div> Getting members... </div>
      )}
    </div>
  );
}

function UITreeControl() {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <BottomNavigation
      fixed
      activeKey=""
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