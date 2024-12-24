import React from "react";
import { t } from "i18next";
import { Avatar, Button, Grid, Select, Sheet } from "zmp-ui";

import average from "pages/family-tree/sample/average.json";
import divorced from "pages/family-tree/sample/divorced.json";
import severalSprouses from "pages/family-tree/sample/several-sprouses.json";
import odooSample from "pages/family-tree/sample/odoo-sample.json";

import { CommonUtils } from "utils";
import { Header, CommonIcon, FamilyTree, TreeNode, TreeConfig } from "components";
import { TreeDataProcessor } from 'pages/family-tree/TreeDataProcessor';
import { TreeUtils } from 'pages/family-tree/TreeUtils';
import { useAppContext } from "hooks";

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
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState(false);

  const [ memberInfo, setMemberInfo ] = React.useState<any>(null);

  React.useEffect(() => {
    setNodes(average);
    setRootId(average[0].id);
  }, [ reload ])

  const showMemberDetail = () => {
    const data = nodes.find((m: any) => m.id === selectId);
    setMemberInfo(data);
    setSelectId(""); // hide the sheet
  }

  const renderTreeBranch = () => {
    const treeBranch = TreeUtils.getBranch(selectId, nodes);
    setRootId(selectId);
    setNodes(treeBranch);
    setResetBtn(true);
    setSelectId(""); // hide the sheet
  }

  const onReset = resetBtn ? () => {
    setReload(!reload);
    setResetBtn(false);
  } : undefined;

  const renderTree = () => {
    return (
      <div>
        <div className="ml-1 mr-1">
          <Select
            defaultValue={1}
            onChange={(val) => {
              if (val === 4) {
                const odooData = dataSrcKey[Number(val)];
                const processor = new TreeDataProcessor(odooData);
                const ancestor = processor.getAncestor();
                setNodes(processor.peopleToNodes());
                setRootId(ancestor?.id);
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
        </div>

        <FamilyTree
          nodes={nodes as any}
          rootId={rootId}
          nodeWidth={TreeConfig.nodeWidth}
          nodeHeight={TreeConfig.nodeHeight}
          searchFields={["id", "name"]}
          searchDisplayField="name"
          statsForNerds
          onReset={onReset}
          renderNode={(node: any) => (
            <TreeNode
              key={node.id}
              node={node}
              displayField={selectNameField}
              isRoot={node.id === rootId}
              onSelectNode={(id: string) => setSelectId(id)}
            />
          )}
        />
      </div>
    )
  }

  const { settings } = useAppContext();
  let background;
  if (settings.background && settings.background.id) {
    background = {
      backgroundImage: `url(http://localhost:8069${settings.background.path})`,
    }
  } else background = {
    backgroundColor: `var(--tree-background-color) !important`,
  }

  return (
    <div
      id="tree-container"
      style={{ ...background }}
    >
      <Header title={t("dummy_tree")}/>
      
      {renderTree()}

      {!CommonUtils.isStringEmpty(selectId) && (
        <UITreeOptions
          visible={!CommonUtils.isStringEmpty(selectId)}
          title={`${selectId}`}
          onClose={() => { setSelectId("") }}
          showMemberDetail={showMemberDetail}
          renderTreeBranch={renderTreeBranch}
        />
      )}

      {!CommonUtils.isNullOrUndefined(memberInfo) && (
        <UIMemberDetail
          visible={!CommonUtils.isNullOrUndefined(memberInfo)}
          info={memberInfo}
          onClose={() => { setMemberInfo(null) }}
        />
      )}
    </div>
  )
}

interface UITreeOptionsProps {
  visible: boolean;
  onClose: () => void;
  showMemberDetail: () => void;
  renderTreeBranch: () => void;
  title?: string;
}
function UITreeOptions(props: UITreeOptionsProps) {
  const { visible, onClose, showMemberDetail, renderTreeBranch, title } = props;
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      mask
      autoHeight
      handler
      swipeToClose
      title={title}
    >
      <div className="p-2">
        <Grid columnCount={2} columnSpace="0.2rem">
          <Button variant="primary" onClick={showMemberDetail} prefixIcon={<CommonIcon.User size={"1.5rem"}/>}>
            {t("btn_tree_member_info")}
          </Button>
          <Button variant="primary" onClick={renderTreeBranch} prefixIcon={<CommonIcon.Tree size={"1.5rem"}/>}>
            {t("btn_tree_member_detail")}
          </Button>
        </Grid>
      </div>
    </Sheet>
  )
}

interface UIMemberDetailProps {
  visible: boolean;
  info: any;
  onClose: () => void;
}
function UIMemberDetail(props: UIMemberDetailProps) {
  const { visible, info, onClose } = props;

  return (
    <Sheet
      visible={visible} mask autoHeight handler swipeToClose
      onClose={onClose} 
      title={info["name"] || t("member_info")}
    >
      <pre className="scroll-h" style={{ maxHeight: "50vh" }}>
        {JSON.stringify(info, null, 2)}
      </pre>
    </Sheet>
  )
}