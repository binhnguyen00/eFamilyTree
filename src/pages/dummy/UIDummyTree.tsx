import React from "react";
import { t } from "i18next";
import FamilyTree from "../../components/tree/FamilyTree";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { BottomNavigation, Modal, Select } from "zmp-ui";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { Node } from "../../components/node/Node";
import { CommonComponentUtils } from "../../components/common/CommonComponentUtils";
import { FamilyTreeUtils, NODE_HEIGHT, NODE_WIDTH } from "../../pages/family-tree/FamilyTreeUtils";

import average from "../family-tree/sample/average.json";
import divorced from "../family-tree/sample/divorced.json";
import severalSprouses from "../family-tree/sample/several-sprouses.json";
import odooSample from "../family-tree/sample/odoo-sample.json";

export function UIDummyTree() {
  const dataSrcKey = {
    1: average,
    2: severalSprouses,
    3: divorced,
    4: odooSample
  }
  const [ nodes, setNodes ] = React.useState<any[]>(average);
  const [ rootId, setRootId ] = React.useState(nodes[0].id);
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ selectNameField, setSelectNameField ] = React.useState<string>("id");

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("dummy_tree"))}

      {nodes.length > 0 ? (
        <div style={{ height: "90%" }}>
          <Select
            label={t("data_source")}
            defaultValue={1}
            onChange={(val) => {
              if (val === 4) {
                const odooSample = dataSrcKey[Number(val)];
                const odooMems = odooSample["members"] || null as any;
                const members = FamilyTreeUtils.remapServerData(odooMems);
                setNodes(members);
                setRootId(members[0].id);
                setSelectNameField("name");
              } else {
                const members = dataSrcKey[Number(val)];
                setNodes(members);
                setRootId(members[0].id); 
                setSelectNameField("id");
              } 
            }}
            closeOnSelect
          >
            <Select.Option value={1} title={t("average")} />
            <Select.Option value={2} title={t("several_spouses")} />
            <Select.Option value={3} title={t("divorced")} />
            <Select.Option value={4} title={t("Odoo")} />
          </Select>

          <TransformWrapper centerOnInit minScale={0.01}>
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
                        displayField={selectNameField}
                        isRoot={node.id === rootId}
                        onSelectNode={setSelectId}
                        style={FamilyTreeUtils.calculateNodePosition(node)}
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