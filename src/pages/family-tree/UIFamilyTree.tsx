import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { TreeMember } from "types/common";
import { ServerResponse } from "types/server";
import { ExtNode, Node } from "components/tree-relatives/types";
import { TreeUtils, TreeDataProcessor } from "utils";
import { useAppContext, useFamilyTree, useNotification, usePageContext } from "hooks";
import { Header, TreeNode, FamilyTree, TreeConfig, Loading, Retry } from "components";

import { UICreateSpouse } from "./UICreateSpouse";
import { UICreateChild } from "./UICreateChild";
import { UICreateRoot } from "./UICreateRoot";
import { UICreateSibling } from "./UICreateSibling";
import { UITreeMember } from "./UITreeMember";

import { img_1 } from "assets/img/about/index";

export enum CreateMode {
  NONE = "none",
  CHILD = "child",
  SPOUSE = "spouse",
  SIBLING = "sibling",
}

export function UIFamilyTree() {
  const { useSearchFamilyTree } = useFamilyTree();
  const { processor, error, loading, refresh } = useSearchFamilyTree();

  const renderContainer = () => {
    if (loading) {
      return <div className="container"> <Loading/> </div>
    } else if (error) {
      return (
        <div className="container">
          <br />
          <div className="flex-v center text-base">
            <Text.Title size="xLarge"> {t("Phả đồ chưa có thành viên nào")} </Text.Title>
            <Text size="large"> {t("Hãy liên hệ với Người quản lý để tạo thành viên đầu tiên")} </Text>
            <Retry title={""} onClick={() => refresh()}/>
            <img src={img_1} className="w-50 h-50"/>
          </div>
        </div>
      )
    } else {
      return <UIFamilyTreeContainer processor={processor} onReload={refresh}/>
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
  const [ createMode, setCreateMode ] = React.useState<CreateMode>(CreateMode.NONE);

  const { loadingToast } = useNotification();
  const { userInfo } = useAppContext();
  const { module, permissions } = usePageContext();

  if (processor.nodes.length === 0) {
    if (!permissions.canWrite) return (
      <div className="container flex-v center text-base">
        <Text.Title size="xLarge"> {t("Phả đồ chưa có thành viên nào")} </Text.Title>
        <Text size="large"> {t("Hãy liên hệ với Người quản lý để tạo thành viên đầu tiên")} </Text>
        <img src={img_1} className="w-50 h-50"/>
      </div>
    );
    return (
      <div className="container">
        <UICreateRoot
          onReloadParent={onReload}
          onClose={() => setCreateMode(CreateMode.NONE)}
          visible={permissions.canWrite} module={module} permissions={permissions}
        />
      </div>
    )
  }

  const [ reload,   setReload ] = React.useState(false);
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ node,   setNode ] = React.useState<TreeMember | null>(null);
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
    loadingToast({
      content: <p> {t("Đang tải dữ liệu...")} </p>,
      operation: (successToastCB, dangerToastCB, dismissToast) => {
        FamilyTreeApi.getMemberInfo({
          userId: userInfo.id, 
          clanId: userInfo.clanId,
          id: parseInt(node.id),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("Vui lòng thử lại"));
            } else {
              const data = result.data as any;
              setNode({
                id:             data.id,
                code:           data.code,
                name:           data.name,
                phone:          data.phone,
                birthday:       data.birthday,
                lunarDeathDay:  data.lunar_death_day,
                deathDateNote:  data.death_date_note,
                gender:         data.gender,
                generation:     data.generation,
                father:         data.father,
                fatherId:       data.father_id,
                mother:         data.mother,
                motherId:       data.mother_id,
                children:       data.children,
                spouses:        data.spouses,
                avatar:         data.avatar,
                achievements:   data.achievements,
              });
              dismissToast();
            }
          },
          fail: () => dangerToastCB(t("Vui lòng thử lại"))
        });
      }
    }) 
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

      <UITreeMember
        visible={node !== null}
        info={node} permissions={permissions} module={module} processor={processor}
        onCreateChild={() => setCreateMode(CreateMode.CHILD)}
        onCreateSpouse={() => setCreateMode(CreateMode.SPOUSE)}
        onCreateSibling={() => setCreateMode(CreateMode.SIBLING)}
        onClose={() => setNode(null)} toSubNodes={toBranch} onReloadParent={onReload}
      />

      <UICreateSpouse
        spouse={node}
        visible={CreateMode.SPOUSE === createMode}
        onClose={() => setCreateMode(CreateMode.NONE)} onReloadParent={onReload}
      />

      <UICreateChild
        dad={node} processor={processor}
        visible={CreateMode.CHILD === createMode}
        onClose={() => setCreateMode(CreateMode.NONE)} onReloadParent={onReload}
      />

      <UICreateSibling
        sibling={node}
        visible={CreateMode.SIBLING === createMode}
        onClose={() => setCreateMode(CreateMode.NONE)} onReloadParent={onReload}
      />
    </>
  )
}