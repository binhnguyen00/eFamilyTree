import React from "react";
import { t } from "i18next";
import { Button, Grid, Select, Sheet, Text, useNavigate, ZBox } from "zmp-ui";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import FamilyTree from "components/tree/FamilyTree";
import TreeNode from "components/node/TreeNode";

import { CommonComponentUtils } from "components/common/CommonComponentUtils";
import { UITreeControl } from "pages/family-tree/UIFamilyTree";
import { FamilyTreeUtils, NODE_HEIGHT, NODE_WIDTH } from "utils/FamilyTreeUtils";

import average from "pages/family-tree/sample/average.json";
import divorced from "pages/family-tree/sample/divorced.json";
import severalSprouses from "pages/family-tree/sample/several-sprouses.json";
import odooSample from "pages/family-tree/sample/odoo-sample.json";

// icons
import {UIHeader} from "components/common/UIHeader";
import CommonIcons from "components/icon/common";

export default function UIDummyTree() {
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

  const navigate = useNavigate();
  const showMemberDetail = () => {
    setSelectId("");
    const data = nodes.find((m: any) => m.id === selectId);
    navigate("/dummy-detail", { state: { data } });
  }

  const renderTreeBranch = () => {
    setSelectId("");
    const treeBranch = FamilyTreeUtils.getTreeBranch(selectId, nodes);
    console.log(treeBranch);
    setRootId(selectId);
    setNodes(treeBranch);
  }

  const renderTree = () => {
    if (nodes.length > 0) {
      return (
        <>
          <Select
            label={<p className="text-capitalize"> {t("data_source")} </p>}
            defaultValue={1}
            onChange={(val) => {
              if (val === 4) {
                const odooSample = dataSrcKey[Number(val)];
                const odooMems = odooSample["members"] || null as any;
                const members = FamilyTreeUtils.remapServerData(odooMems);
                const final = FamilyTreeUtils.removeDuplicates(members);
                console.log(members);
                
                setNodes(final);
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

          <TransformWrapper 
            minScale={0.1} 
            centerOnInit 
            centerZoomedOut
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <div style={{ width: "100%", height: "100%", position: "fixed" }}>
                <TransformComponent>
                  <FamilyTree
                    nodes={nodes as any}
                    rootId={rootId}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    renderNode={(node: any) => (
                      <TreeNode
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
              </div>
            )}
          </TransformWrapper>

          <Sheet
            visible={selectId !== ""}
            onClose={() => { setSelectId("") }}
            mask
            autoHeight
            handler
            swipeToClose
            title="Thành Viên"
          >
            <Text className="center"> {selectId} </Text>
            <ZBox padding="1rem">
              <Grid columnCount={2} columnSpace="1rem" rowSpace="1rem">
                <Button className="" onClick={showMemberDetail} prefixIcon={<CommonIcons.User size={"1.5rem"}/>}>
                  {t("btn_tree_member_info")}
                </Button>
                <Button onClick={renderTreeBranch} prefixIcon={<CommonIcons.Tree size={"1.5rem"}/>}>
                  {t("btn_tree_member_detail")}
                </Button>
              </Grid>
            </ZBox>
          </Sheet>
        </>
      )
    } else return (
      CommonComponentUtils.renderLoading(t("loading"))
    )
  }

  return (
    <div className="container">
      <UIHeader title={t("dummy_tree")}/>

      {renderTree()}
    </div>
  )
}