import React from "react";
import { t } from "i18next";

import { FamilyTreeApi } from "api";
import { useAppContext } from "hooks";
import { TreeUtils, TreeDataProcessor } from "utils";
import { Header, TreeNode, FamilyTree, TreeConfig, Loading } from "components";

import { ExtNode } from "components/tree-relatives/types";
import { ServerResponse, FailResponse } from "types/server";

import { UICreateSpouse } from "./UICreateSpouse";
import { CreateMode, Member, UITreeMemberDetails } from "./UIFamilyTreeDetails";
import { UICreateChild } from "./UICreateChild";
import { UICreateRoot } from "./UICreateRoot";
import { UICreateSibling } from "./UICreateSibling";

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
    FamilyTreeApi.searchMembers({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success, fail
    });
  }, [ reload ]);

  if (loading) return (
    <>
      <Header title={t("family_tree")} />
      <Loading message={t("loading_family_tree")} />      
    </>
  ) 
  else return (
    <UIFamilyTreeContainer 
      processor={processor}
      onReload={() => setReload(!reload)}
    />
  )
}

interface UIFamilyTreeContainerProps {
  processor: TreeDataProcessor;
  onReload?: () => void;
}
export function UIFamilyTreeContainer(props: UIFamilyTreeContainerProps) { 
  const { processor, onReload } = props;

  const { userInfo } = useAppContext();

  const [ reload, setReload ] = React.useState(false);
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ rootId, setRootId ] = React.useState<string>(processor.rootId);
  const [ node, setNode ] = React.useState<Member | null>(null);
  const [ nodes, setNodes ] = React.useState<any[]>(processor.nodes);

  const [ zoomElement, setZoomElement ] = React.useState<HTMLElement>();

  const [ createMode, setCreateMode ] = React.useState<CreateMode | null>(null);

  React.useEffect(() => {
    setNodes(processor.nodes);
    setRootId(processor.rootId);
  }, [ reload ]);

  const toBranch = () => {
    const treeBranch = TreeUtils.getBranch(node!.id.toString(), nodes);
    setNodes(treeBranch);
    setRootId(node!.id.toString());
    setResetBtn(true);
    setNode(null); // To close slider when select branch

    // wait for 0.5s for the tree to finish rendering. this wont work everytime!
    setTimeout(() => {
      const element = document.getElementById(`node-${node!.id}`);
      setZoomElement(element!);
    }, 500); 
  }

  const onReset = resetBtn ? () => {
    setReload(!reload);
    setResetBtn(false);
    setZoomElement(undefined);
  } : undefined;

  const onSelect = (node: ExtNode) => {
    console.log(node);
    
    FamilyTreeApi.getMemberInfo({
      userId: userInfo.id, 
      clanId: userInfo.clanId,
      id: parseInt(node.id),
      success: (result: ServerResponse) => {
        if (result.status === "error") {
          console.error("UINodeDetailsPanel:\n\t", result.message);
        } else {
          const data = result.data as Member;
          setNode(data);
        }
      },
      // Debug
      fail: () => {
        setNode(node as any);
      }
    });
  }

  return (
    <>
      <Header title={t("family_tree")}/>

      <div id="tree-container">
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
              onSelectNode={onSelect}
            />
          )}
          zoomElement={zoomElement}
        />
      </div>

      <UITreeMemberDetails
        info={node}
        visible={node !== null ? true : false} 
        onClose={() => setNode(null)}
        toBranch={toBranch}
        processor={processor}
        onCreateChild={() => setCreateMode(CreateMode.CHILD)}
        onCreateSpouse={() => setCreateMode(CreateMode.SPOUSE)}
        onCreateSibling={() => setCreateMode(CreateMode.SIBLING)}
      />

      {/* <UICreateRoot
        visible={nodes.length ? false : true}
      /> */}

      <UICreateSpouse 
        spouse={node} 
        visible={createMode && createMode === CreateMode.SPOUSE ? true : false}
        onClose={() => setCreateMode(null)} 
      />

      <UICreateChild
        dad={node}
        visible={createMode && createMode === CreateMode.CHILD ? true : false}
        onClose={() => setCreateMode(null)} 
        processor={processor}
      />

      <UICreateSibling
        sibling={node}
        visible={createMode && createMode === CreateMode.SIBLING ? true : false}
        onClose={() => setCreateMode(null)} 
      />
    </>
  )
}