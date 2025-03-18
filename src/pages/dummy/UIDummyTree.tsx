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
  const firstNodeId = React.useMemo(() => nodes[0].id, [nodes]);
  const [ rootId, setRootId ] = React.useState(firstNodeId);

  const [ zoomElement, setZoomElement ] = React.useState<HTMLElement>();

  React.useEffect(() => {
    setNodes(average);
    setRootId(average[0].id);
  }, [ reload ])

  const zoomToNode = (nodeId: string) => {
    setTimeout(() => {
      const element = document.getElementById(`node-${nodeId}`);
      if (!element) return;
      setZoomElement(element);
    }, 250);
  }

  const toBranch = (nodeId: string) => {
    const subNodes = TreeUtils.getSubNodes(nodeId, nodes);
    setRootId(nodeId);
    setNodes(subNodes);
    setResetBtn(true);
    setNode({}); // To close slider when select branch
    zoomToNode(nodeId);
  }

  const toSubNodes = (nodeId: string) => {
    setRootId(nodeId);
    setResetBtn(true);
    zoomToNode(nodeId);
  }

  const renderContainer = () => {
    const onReset = resetBtn ? () => {
      setReload(!reload);
      setResetBtn(false);
      zoomToNode(firstNodeId);
    } : undefined;

    return (
      <div>
        <FamilyTree
          nodes={nodes}
          rootId={rootId}
          nodeWidth={TreeConfig.nodeWidth}
          nodeHeight={TreeConfig.nodeHeight}
          onReset={onReset}
          renderNode={(node) => (
            <TreeNode
              key={node.id}
              node={node}
              displayField={"id"}
              isRoot={node.id === rootId}
              onSelectNode={(node) => setNode(node)}
              onSelectSubNode={(node) => toSubNodes(node.id)}
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
        onSubNodes={toBranch}
      />
    </>
  )
}

interface UINodeDetailsPanelProps {
  info: any;
  visible: boolean;
  onClose: () => void;
  onSubNodes?: (nodeId: string) => void;
}
export function UINodeDetailsPanel(props: UINodeDetailsPanelProps) {
  const { info, visible, onClose, onSubNodes } = props;

  const height = "70vh";
  return (
    <></>
  )
}
