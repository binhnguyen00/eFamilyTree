import React from "react";
import { t } from "i18next";

import { FamilyTreeApi } from "api";
import { useAppContext } from "hooks";
import { CommonUtils, TreeUtils, TreeDataProcessor } from "utils";
import { Header, TreeNode, FamilyTree, TreeConfig, Loading } from "components";

import { UserInfo } from "types/app-context";
import { ExtNode } from "components/tree-relatives/types";
import { ServerResponse, FailResponse } from "types/server";

import { UINodeDetailsPanel } from "./UINodeDetails";

export function UIFamilyTree() {
  const { userInfo } = useAppContext();
  const [ reload, setReload ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);
  const [ processor, setProcessor ] = React.useState<TreeDataProcessor>(new TreeDataProcessor([]));

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error("UIFamilyTree:\n\t", result.message);
      } else {
        const data = result.data as any;
        const newProcessor = new TreeDataProcessor(data);
        setProcessor(newProcessor);
      }
    }
    const fail = (error: FailResponse) => {
      setLoading(false);
      console.error("UIFamilyTree:\n\t", error.message, "\n", error.stackTrace);
    } 
    FamilyTreeApi.getMembers(userInfo.id, userInfo.clanId, success, fail);
  }, [ reload ]);

  if (loading) return (
    <div className="container">
      <Header title={t("family_tree")} />
      <Loading message={t("loading_family_tree")} />      
    </div>
  ) 
  else return (
    <UIFamilyTreeContainer 
      nodes={processor.nodes}
      rootId={processor.rootId}
      userInfo={userInfo}
      onReload={() => setReload(!reload)}
    />
  )
}

interface UIFamilyTreeContainerProps {
  nodes: any[];
  rootId: string;
  userInfo: UserInfo;
  onReload?: () => void;
}
export function UIFamilyTreeContainer(props: UIFamilyTreeContainerProps) { 
  const [ reload, setReload ] = React.useState(false);
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ rootId, setRootId ] = React.useState<string>(props.rootId);
  const [ node, setNode ] = React.useState<ExtNode | any>({});
  const [ nodes, setNodes ] = React.useState<any[]>(props.nodes);

  const [ zoomElement, setZoomElement ] = React.useState<HTMLElement>();

  React.useEffect(() => {
    setNodes(props.nodes);
    setRootId(props.rootId);
  }, [ reload ]);

  const toBranch = (nodeId: string) => {
    const treeBranch = TreeUtils.getBranch(node.id, nodes);
    setNodes(treeBranch);
    setRootId(node.id);
    setResetBtn(true);
    setNode({}); // To close slider when select branch

    // wait for 0.5s for the tree to finish rendering. this wont work everytime!
    setTimeout(() => {
      const element = document.getElementById(`node-${nodeId}`);
      setZoomElement(element!);
    }, 500); 
  }

  const onReset = resetBtn ? () => {
    setReload(!reload);
    setResetBtn(false);
    setZoomElement(undefined);
  } : undefined;

  return (
    <div id="tree-container">
      <Header title={t("family_tree")}/>
      
      <FamilyTree
        nodes={nodes}
        rootId={rootId}
        nodeHeight={TreeConfig.nodeHeight}
        nodeWidth={TreeConfig.nodeWidth}
        searchFields={["id", "name"]}
        searchDisplayField="name"
        onReset={onReset}
        renderNode={(node: any) => (
          <TreeNode
            key={node.id}
            node={node}
            displayField="name"
            isRoot={node.id === rootId}
            onSelectNode={(node: ExtNode) => setNode(node)}
          />
        )}
        zoomElement={zoomElement}
      />

      {node.id && (
        <UINodeDetailsPanel
          id={node.id}
          visible={!CommonUtils.isNullOrUndefined(node)} 
          onClose={() => setNode({})}
          onSelectBranch={toBranch}
        />
      )}
    </div>
  )
}