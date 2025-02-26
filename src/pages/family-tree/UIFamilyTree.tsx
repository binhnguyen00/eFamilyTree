import React from "react";
import { t } from "i18next";

import { FamilyTreeApi } from "api";
import { useAppContext, useNotification } from "hooks";
import { TreeUtils, TreeDataProcessor } from "utils";
import { Header, TreeNode, FamilyTree, TreeConfig, Loading } from "components";

import { ExtNode } from "components/tree-relatives/types";
import { ServerResponse, FailResponse } from "types/server";

import { UICreateSpouse } from "./UICreateSpouse";
import { CreateMode, Member, UITreeMemberDetails } from "./UIFamilyTreeDetails";
import { UICreateChild } from "./UICreateChild";
import { UICreateRoot } from "./UICreateRoot";
import { UICreateSibling } from "./UICreateSibling";

export function useFamilyTree() {
  const { userInfo } = useAppContext();

  const [ processor, setProcessor ] = React.useState<TreeDataProcessor>(new TreeDataProcessor([]));
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error(result.message);
        setError(true);
      } else {
        const data = result.data as any;
        const newProcessor = new TreeDataProcessor(data);
        setProcessor(newProcessor);
      }
    }
    const fail = (error: FailResponse) => {
      setLoading(false);
      setError(true);
      console.error("UIFamilyTree:\n\t", error.message, "\n", error.stackTrace);
    } 
    FamilyTreeApi.searchMembers({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success, fail
    });
  }, [ reload ]);

  return { processor, loading, error, refresh }
}

export function UIFamilyTree() {
  const { processor, error, loading, refresh } = useFamilyTree();

  if (loading) {
    return (
      <div className="container max-h bg-white">
        <Header title={t("family_tree")} />
        <Loading/>      
      </div>
    ) 
  } else {
    return (
      <UIFamilyTreeContainer 
        processor={processor}
        onReload={refresh}
      />
    )
  }
}

interface UIFamilyTreeContainerProps {
  processor: TreeDataProcessor;
  onReload?: () => void;
}
export function UIFamilyTreeContainer(props: UIFamilyTreeContainerProps) { 
  const { processor, onReload } = props;
  const { userInfo } = useAppContext();
  const { loadingToast, warningToast } = useNotification();

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
  }, [ reload, onReload ]);

  React.useEffect(() => {
    if (!nodes.length) setCreateMode(CreateMode.ROOT);
  }, [ nodes ]);

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
    loadingToast(
      <div className="flex-v">
        <p> {t("đang tải dữ liệu")} </p>
        <p> {t("vui lòng chờ")} </p>
      </div>,
      (successToastCB, dangerToastCB) => {
        FamilyTreeApi.getMemberInfo({
          userId: userInfo.id, 
          clanId: userInfo.clanId,
          id: parseInt(node.id),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              console.error(result.message);
              warningToast(t("vui lòng thử lại"));
            } else {
              successToastCB(t("lấy dữ liệu thành công"));
              const data = result.data as any;
              setNode({
                id: data.id,
                code: data.code,
                name: data.name,
                phone: data.phone,
                birthday: data.birthday,
                gender: data.gender,
                generation: data.generation,
                father: data.father,
                fatherId: data.father_id,
                mother: data.mother,
                motherId: data.mother_id,
                children: data.children,
                spouses: data.spouses,
                achievements: data.achievements,
                avatar: data.avatar,
              });
            }
          },
          fail: () => {
            warningToast(t("vui lòng thử lại"));
          }
        });
      }
    )
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
        onCreateChild={() => setCreateMode(CreateMode.CHILD)}
        onCreateSpouse={() => setCreateMode(CreateMode.SPOUSE)}
        onCreateSibling={() => setCreateMode(CreateMode.SIBLING)}
        onReloadParent={onReload}
      />

      <UICreateRoot
        visible={createMode && createMode === CreateMode.ROOT ? true : false}
        onClose={() => setCreateMode(null)} 
        onReloadParent={onReload}
      />

      <UICreateSpouse 
        spouse={node} 
        visible={createMode && createMode === CreateMode.SPOUSE ? true : false}
        onClose={() => setCreateMode(null)} 
        onReloadParent={onReload}
      />

      <UICreateChild
        dad={node}
        visible={createMode && createMode === CreateMode.CHILD ? true : false}
        onClose={() => setCreateMode(null)} 
        processor={processor}
        onReloadParent={onReload}
      />

      <UICreateSibling
        sibling={node}
        visible={createMode && createMode === CreateMode.SIBLING ? true : false}
        onClose={() => setCreateMode(null)} 
        onReloadParent={onReload}
      />
    </>
  )
}