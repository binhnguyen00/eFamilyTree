import React from "react";
import { t } from "i18next";
import { Box, Button, Grid, Input, Select } from "zmp-ui";

import average from "./sample/average.json";
import divorced from "./sample/divorced.json";
import odooSample from "./sample/odoo-sample.json";
import severalSprouses from "./sample/several-sprouses.json";

import { CommonUtils, TreeUtils, TreeDataProcessor} from "utils";
import { Header, CommonIcon, FamilyTree, TreeNode, TreeConfig, SlidingPanel, SlidingPanelOrient } from "components";

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
  const [ processor, setProcessor ] = React.useState<TreeDataProcessor>(new TreeDataProcessor([]));

  const [ memberInfo, setMemberInfo ] = React.useState<any>(null);

  React.useEffect(() => {
    setNodes(average);
    setRootId(average[0].id);
  }, [ reload ])

  const showMemberDetail = () => {
    const data = nodes.find((m: any) => m.id === selectId);
    setMemberInfo(data);
    setSelectId(""); // hide the sliding panel
  }

  const renderTreeBranch = () => {
    const treeBranch = TreeUtils.getBranch(selectId, nodes);
    setRootId(selectId);
    setNodes(treeBranch);
    setResetBtn(true);
    setSelectId(""); // hide the sliding panel
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
                setProcessor(processor);
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
            <Select.Option value={4} title={t("Odoo")} />
            <Select.Option value={1} title={t("average")} />
            <Select.Option value={2} title={t("several_spouses")} />
            <Select.Option value={3} title={t("divorced")} />
          </Select>
        </div>

        <FamilyTree
          nodes={nodes as any}
          rootId={rootId}
          nodeWidth={TreeConfig.nodeWidth}
          nodeHeight={TreeConfig.nodeHeight}
          searchFields={["gid", "name"]}
          searchDisplayField="name"
          onReset={onReset}
          processor={processor}
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

  return (
    <div id="tree-container">
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
    <SlidingPanel
      orient={SlidingPanelOrient.BottomToTop}
      visible={visible}
      close={onClose}
      header={title}
    >
      <div className="p-2">
        <Grid columnCount={2} columnSpace="0.2rem">
          <Button variant="secondary" onClick={showMemberDetail} prefixIcon={<CommonIcon.User size={"1.5rem"}/>}>
            {t("btn_tree_member_info")}
          </Button>
          <Button variant="secondary" onClick={renderTreeBranch} prefixIcon={<CommonIcon.Tree size={"1.5rem"}/>}>
            {t("btn_tree_member_detail")}
          </Button>
        </Grid>
      </div>
    </SlidingPanel>
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
    <SlidingPanel
      orient={SlidingPanelOrient.BottomToTop}
      visible={visible}
      close={onClose}
      header={info["name"] || t("member_info")}
    >
    <Box className="p-2" style={{ maxHeight: "50vh", color: `cal(var(--primary-color))` }}>
      <Input label={"Họ Tên"} value={info["name"]} />
      <Input label={"Giới tính"} value={info["gender"] === "1" ? t("male") : t("female")} />
      <Input label={"Điện thoại"} value={info["phoneNumber"]} />
      <Input label={"Bố"} value={info["father"]} />
      <Input label={"Mẹ"} value={info["mother"]} />
    </Box>
    </SlidingPanel>
  )
}