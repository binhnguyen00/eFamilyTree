import React from "react";
import { t } from "i18next";
import { Button } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { useAppContext, useNotification } from "hooks";
import { TreeUtils, TreeDataProcessor } from "utils";
import { Header, TreeNode, FamilyTree, TreeConfig, Loading, Info, CommonIcon } from "components";

import { ExtNode, Node } from "components/tree-relatives/types";
import { ServerResponse } from "types/server";

import { UICreateSpouse } from "./UICreateSpouse";
import { UICreateChild } from "./UICreateChild";
import { UICreateRoot } from "./UICreateRoot";
import { UICreateSibling } from "./UICreateSibling";
import { CreateMode, Member, UITreeMemberDetails } from "./UIFamilyTreeDetails";
import { ServerNodeFormat } from "utils/TreeDataProcessor";

export function useFamilyTree() {
  const { userInfo } = useAppContext();

  const [ processor, setProcessor ] = React.useState<TreeDataProcessor>(new TreeDataProcessor([]));
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setProcessor(new TreeDataProcessor([]))
    
    FamilyTreeApi.searchMembers({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "error") {
          setError(true);
        } else {
          const data = result.data as ServerNodeFormat[];
          const treeProcessor = new TreeDataProcessor(data);
          setProcessor(treeProcessor);
        }
      }, 
      fail: () => {
        setLoading(false);
        setError(true);
      }
    });
  }, [ reload ]);

  return { processor, loading, error, refresh }
}

export function UIFamilyTree() {
  const { processor, error, loading, refresh } = useFamilyTree();

  const renderContainer = () => {
    if (loading) {
      return (
        <div className="max-h">
          <Loading/>
        </div>
      )
    } else if (error) {
      return (
        <div className="flex-v flex-grow-0 max-h container">
          <Info title={t("Chưa có dữ liệu")}/>
          <div className="center">
            <Button size="small" prefixIcon={<CommonIcon.Reload size={"1rem"}/>} onClick={() => refresh()}>
              {t("retry")}
            </Button>
          </div>
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

  return (
    <>
      <Header title={t("gia phả lạc hồng")} />

      <div className="bg-white">
        {renderContainer()}
      </div>
    </>
  ) 
}

interface UIFamilyTreeContainerProps {
  processor: TreeDataProcessor;
  onReload?: () => void;
}
export function UIFamilyTreeContainer(props: UIFamilyTreeContainerProps) { 
  const { processor, onReload } = props;
  const [ createMode, setCreateMode ] = React.useState<CreateMode | null>(null);

  if (processor.nodes.length === 0) {
    return (
      <div id="tree-container">
        <UICreateRoot
          visible={true}
          onClose={() => setCreateMode(null)} 
          onReloadParent={onReload}
        />
      </div>
    )
  }

  const { userInfo } = useAppContext();
  const { loadingToast } = useNotification();

  const [ reload,   setReload ] = React.useState(false);
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ node,   setNode ] = React.useState<Member | null>(null);
  const [ nodes,  setNodes ] = React.useState<Node[]>(processor.nodes);
  const [ rootId, setRootId ] = React.useState<string>(processor.rootId);
  const firstRootId = React.useMemo(() => rootId, [nodes]);

  const [ zoomElement, setZoomElement ] = React.useState<HTMLElement>();

  React.useEffect(() => {
    setNodes(processor.nodes);
    setRootId(processor.rootId);
  }, [ reload, onReload ]);

  const zoomToNode = (nodeId: string) => {
    setTimeout(() => {
      const element = document.getElementById(`node-${nodeId}`);
      if (!element) return;
      setZoomElement(element);
    }, 500);
  }

  const toBranch = (nodeId: string) => {
    const subNodes = TreeUtils.getSubNodes(nodeId, nodes);
    setNodes(subNodes);
    setRootId(nodeId);
    setResetBtn(true);
    setNode(null); // To close slider when select branch
    zoomToNode(nodeId);
  }

  const toSubNodes = (nodeId: string) => {
    setRootId(nodeId);
    setResetBtn(true);
    zoomToNode(nodeId);
  }

  const onReset = resetBtn ? () => {
    setReload(!reload);
    setResetBtn(false);
    zoomToNode(firstRootId);
  } : undefined;

  const onSelect = (node: ExtNode) => {
    loadingToast(
      <p> {t("đang tải dữ liệu...")} </p>,
      (successToastCB, dangerToastCB, dismissToast) => {
        FamilyTreeApi.getMemberInfo({
          userId: userInfo.id, 
          clanId: userInfo.clanId,
          id: parseInt(node.id),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("vui lòng thử lại"));
            } else {
              const data = result.data as any;
              setNode({
                id:           data.id,
                code:         data.code,
                name:         data.name,
                phone:        data.phone,
                birthday:     data.birthday,
                gender:       data.gender,
                generation:   data.generation,
                father:       data.father,
                fatherId:     data.father_id,
                mother:       data.mother,
                motherId:     data.mother_id,
                children:     data.children,
                spouses:      data.spouses,
                avatar:       data.avatar,
                achievements: data.achievements,
              });
              dismissToast();
            }
          },
          fail: () => dangerToastCB(t("vui lòng thử lại"))
        });
      }
    ) 
  }

  return (
    <>
      <div id="tree-container">
        <FamilyTree
          nodes={nodes}
          rootId={rootId}
          nodeHeight={TreeConfig.nodeHeight}
          nodeWidth={TreeConfig.nodeWidth}
          onReset={onReset}
          searchDisplayField="name"
          renderNode={(node: ExtNode) => (
            <TreeNode
              key={node.id}
              node={node}
              displayField="name"
              isRoot={node.id === rootId}
              onSelectNode={onSelect}
              onSelectSubNode={(node) => toSubNodes(node.id)}
            />
          )}
          zoomElement={zoomElement}
        />
      </div>

      <UITreeMemberDetails
        info={node}
        processor={processor}
        visible={node !== null ? true : false} 
        onClose={() => setNode(null)}
        toSubNodes={toBranch}
        onCreateChild={() => setCreateMode(CreateMode.CHILD)}
        onCreateSpouse={() => setCreateMode(CreateMode.SPOUSE)}
        onCreateSibling={() => setCreateMode(CreateMode.SIBLING)}
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