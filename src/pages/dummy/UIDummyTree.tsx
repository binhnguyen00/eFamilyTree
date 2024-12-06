import React from "react";
import { t } from "i18next";
import { Button, Grid, Select, Sheet, Text, useNavigate, ZBox } from "zmp-ui";

import average from "pages/family-tree/sample/average.json";
import divorced from "pages/family-tree/sample/divorced.json";
import severalSprouses from "pages/family-tree/sample/several-sprouses.json";
import odooSample from "pages/family-tree/sample/odoo-sample.json";

import { FamilyTreeUtils } from "utils/FamilyTreeUtils";
import { Header, CommonIcon, FamilyTree, TreeNode, TreeConfig } from "components";

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
    return (
      <div className="tree-container" style={{ width: "100vw", height: "100vh", position: "fixed" }}>
        {/* <Select
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
        </Select> */}

        {/* <TransformWrapper 
          minScale={0.1} 
          centerOnInit 
          centerZoomedOut
          initialScale={0.5}
          wheel={{ step: 0.2 }}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <TransformComponent 
                contentStyle={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
              </TransformComponent>

              <UITreeControl />
            </>
          )}
        </TransformWrapper> */}

        <FamilyTree
          nodes={nodes as any}
          rootId={rootId}
          width={TreeConfig.nodeWidth}
          height={TreeConfig.nodeHeight}
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
              <Button className="" onClick={showMemberDetail} prefixIcon={<CommonIcon.User size={"1.5rem"}/>}>
                {t("btn_tree_member_info")}
              </Button>
              <Button onClick={renderTreeBranch} prefixIcon={<CommonIcon.Tree size={"1.5rem"}/>}>
                {t("btn_tree_member_detail")}
              </Button>
            </Grid>
          </ZBox>
        </Sheet>
      </div>
    )
  }

  return (
    <div>
      <Header title={t("dummy_tree")}/>
      
      {renderTree()}
    </div>
  )
}