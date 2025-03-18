import React from "react";
import { t } from "i18next";

import average from "./sample/average.json";

import { TreeUtils } from "utils";
import { Header, FamilyTree, TreeNode, TreeConfig } from "components";

export default function UIDummyTree() {
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
        <FamilyTree
          nodes={nodes as any}
          rootId={rootId}
          nodeWidth={TreeConfig.nodeWidth}
          nodeHeight={TreeConfig.nodeHeight}
          onReset={onReset}
          renderNode={(node: any) => (
            <TreeNode
              key={node.id}
              node={node}
              displayField={"id"}
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
