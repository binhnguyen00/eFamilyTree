import React from "react";
import { t } from "i18next";
import { Box, Button, Input, Select, Text } from "zmp-ui";

import average from "./sample/average.json";
import divorced from "./sample/divorced.json";
import odooSample from "./sample/odoo-sample.json";
import severalSprouses from "./sample/several-sprouses.json";

import { CommonUtils, TreeUtils, TreeDataProcessor} from "utils";
import { Header, FamilyTree, TreeNode, TreeConfig, SlidingPanel, SlidingPanelOrient, CommonIcon } from "components";

export default function UIDummyTree() {
  const dataSrcKey = {
    1: average,
    2: severalSprouses,
    3: divorced,
    4: odooSample
  }
  const [ selectNameField, setSelectNameField ] = React.useState<string>("id");
  const [ processor, setProcessor ] = React.useState<TreeDataProcessor>(new TreeDataProcessor([]));

  const [ reload, setReload ] = React.useState(false);
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ node, setNode ] = React.useState<any>({});
  const [ nodes, setNodes ] = React.useState<any[]>(average);
  const [ rootId, setRootId ] = React.useState(nodes[0].id);

  React.useEffect(() => {
    setNodes(average);
    setRootId(average[0].id);
  }, [ reload ])

  const toBranch = () => {
    setNode({}); // To close slider when select branch
    const treeBranch = TreeUtils.getBranch(node.id, nodes);
    setRootId(node.id);
    setNodes(treeBranch);
    setResetBtn(true);
  }

  const renderContainer = () => {
    const onReset = resetBtn ? () => {
      setReload(!reload);
      setResetBtn(false);
    } : undefined;

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
              onSelectNode={(node: any) => setNode(node)}
            />
          )}
        />
      </div>
    )
  }

  return (
    <div id="tree-container">
      <Header title={t("dummy_tree")}/>
      
      {renderContainer()}

      {node.id && (
        <UINodeDetailsPanel
          info={node}
          visible={node.id}
          onClose={() => setNode({})}
          onSelectBranch={toBranch}
        />
      )}
    </div>
  )
}

interface UINodeDetailsPanelProps {
  info: any;
  visible: boolean;
  onClose: () => void;
  onSelectBranch?: () => void;
}
export function UINodeDetailsPanel(props: UINodeDetailsPanelProps) {
  const { info, visible, onClose, onSelectBranch } = props;

  console.log(info);
  

  const height = "70vh";
  return (
    <SlidingPanel
      orient={SlidingPanelOrient.BottomToTop}
      visible={visible}
      close={onClose}
      className="pb-3"
      header={t("member_info")}
    >
      <Box className="px-2" style={{ height: height }}>
        <React.Fragment>
          <Text.Title className="text-capitalize text-secondary py-2"> {t("info")} </Text.Title>
          <div className="flex-h">
            <Input size="small" label={"Giới tính"} value={info["gender"] === "1" ? t("male") : t("female")} />
            <Input size="small" label={"Điện thoại"} value={info["phoneNumber"]} />
          </div>
          <Input size="small" label={"Họ Tên"} value={info["name"]} />
          <Input size="small" label={"Bố"} value={info["father"]} />
          <Input size="small" label={"Mẹ"} value={info["mother"]} />
        </React.Fragment>

        <React.Fragment>
          <Text.Title className="text-capitalize text-secondary py-2"> {t("utilities")} </Text.Title>
          <Button 
            variant="secondary" 
            size="small" 
            prefixIcon={<CommonIcon.Tree size={16}/>}
            onClick={onSelectBranch}
          >
            {t("btn_tree_member_detail")}
          </Button>
        </React.Fragment>
      </Box>
    </SlidingPanel>
  )
}
