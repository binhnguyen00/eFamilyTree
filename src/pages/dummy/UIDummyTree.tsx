import React from "react";
import { t } from "i18next";
import { Box, Button, Input, Select, Text } from "zmp-ui";

import average from "./sample/average.json";
import divorced from "./sample/divorced.json";
import odooSample from "./sample/odoo-sample.json";
import severalSprouses from "./sample/several-sprouses.json";

import { TreeUtils, TreeDataProcessor } from "utils";
import { Header, FamilyTree, TreeNode, TreeConfig, CommonIcon } from "components";

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

  const [ zoomElement, setZoomElement ] = React.useState<HTMLElement>();

  React.useEffect(() => {
    setNodes(average);
    setRootId(average[0].id);
  }, [ reload ])

  const toBranch = (nodeId: string) => {
    const treeBranch = TreeUtils.getBranch(node.id, nodes);
    setRootId(node.id);
    setNodes(treeBranch);
    setResetBtn(true);
    setNode({}); // To close slider when select branch
    
    // wait for 0.5s for the tree to finish rendering. this wont work everytime!
    setTimeout(() => {
      const element = document.getElementById(`node-${nodeId}`);
      setZoomElement(element!);
    }, 500); 
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
                setRootId(ancestor.id);
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
          zoomElement={zoomElement}
        />
      </div>
    )
  }

  return (
    <>
      <Header title={t("dummy_tree")}/>

      <div id="tree-container">  
        {renderContainer()}
      </div>

      <UINodeDetailsPanel
        info={node}
        visible={node.id ? true : false}
        onClose={() => setNode({})}
        onSelectBranch={toBranch}
      />
    </>
  )
}

interface UINodeDetailsPanelProps {
  info: any;
  visible: boolean;
  onClose: () => void;
  onSelectBranch?: (nodeId: string) => void;
}
export function UINodeDetailsPanel(props: UINodeDetailsPanelProps) {
  const { info, visible, onClose, onSelectBranch } = props;

  const height = "70vh";
  return (
    <></>
  )
}
