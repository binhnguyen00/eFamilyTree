import React from "react";
import { t } from "i18next";
import { Sheet, Grid, Button, useNavigate, Stack } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse, FamilyTreeUtils, EFamilyTreeApi } from "utils";
import { Header, CommonIcon, TreeNode, FamilyTree, TreeConfig, Loading } from "components";
import { Gender, Node } from "components/tree-relatives/types";

export function UIFamilyTree() {
  const phoneNumber = useRecoilValue(phoneState);

  let [ members, setMembers ] = React.useState<any[]>([]);
  let [ rootId, setRootId ] = React.useState<string>("");
  let [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      if (typeof result === 'string') {
        console.warn(result);
      } else {
        const data = result["members"] || null;
        const mems: Node[] = FamilyTreeUtils.remapServerData(data);
        setMembers(FamilyTreeUtils.removeDuplicates(mems));
        setRootId(`${data.id}`);
      }
    }
    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
    } 

    EFamilyTreeApi.getMembers(phoneNumber, success, fail);
  }, [ reload ])

  if (!members.length) {
    return (
      <UIFamilyTreeContainer 
        nodes={[{
          name: t("family_member"), id: "", gender: Gender.male, avatar: "",
          parents: [], siblings: [], spouses: [], children: []
        }]}
        rootId={""}
        phoneNumber={""}
        onReload={() => {}}
      />
    );
  } else {
    return (
      <UIFamilyTreeContainer 
        nodes={members}
        rootId={rootId}
        phoneNumber={phoneNumber}
        onReload={() => setReload(!reload)}
      />
    )
  }
}

interface UIFamilyTreeContainerProps {
  nodes: any[];
  rootId: string;
  phoneNumber: any;
  onReload?: () => void;
}
export function UIFamilyTreeContainer(props: UIFamilyTreeContainerProps) { 
  const navigate = useNavigate();

  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>(props.nodes);
  const [ rootId, setRootId ] = React.useState<string>(props.rootId);
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const showMemberDetail = () => {
    setSelectId("");
    const data = {
      memberId: selectId,
      phoneNumber: props.phoneNumber,
    }
    navigate("/family-member-info", { state: { data } });
  }

  const renderTreeBranch = () => {
    setSelectId("");
    const treeBranch = FamilyTreeUtils.getTreeBranch(selectId, familyMembers);
    setRootId(selectId);
    setFamilyMembers(treeBranch);
    setResetBtn(true);
  }

  const PopupOption = () => {
    return (
      <Sheet
        visible={selectId !== ""}
        onClose={() => { setSelectId("") }}
        autoHeight
        handler
        swipeToClose
        title={`${FamilyTreeUtils.getMemberById(selectId, familyMembers)?.name || t("member_info")}`}
      >
        <Stack space="1rem">
          <div className="p-2">
            <Grid columnCount={2} columnSpace="0.2rem">
              <Button variant="primary" onClick={showMemberDetail} prefixIcon={<CommonIcon.User size={"1.5rem"}/>}>
                {t("btn_tree_member_info")}
              </Button>
              <Button variant="primary" onClick={renderTreeBranch} prefixIcon={<CommonIcon.Tree size={"1.5rem"}/>}>
                {t("btn_tree_member_detail")}
              </Button>
            </Grid>
          </div>
        </Stack>
      </Sheet>
    )
  }

  const onReset = resetBtn ? () => {
    if (props.onReload) props.onReload();
    setResetBtn(false);
  } : undefined;

  const Tree = () => {
    return (
      <div className="tree-container">

        <FamilyTree
          nodes={familyMembers as any}
          rootId={rootId}
          nodeHeight={TreeConfig.nodeHeight}
          nodeWidth={TreeConfig.nodeWidth}
          searchFields={["id", "name"]}
          onReset={onReset}
          renderNode={(node: any) => (
            <TreeNode
              key={node.id}
              node={node}
              displayField="name"
              isRoot={node.id === rootId}
              onSelectNode={(id: string) => setSelectId(id)}
              style={FamilyTreeUtils.calculateNodePosition(node)}
            />
          )}
        />

        <PopupOption/>

      </div>
    );
  }

  return (
    <div>
      <Header title={t("family_tree")}/>

      <Tree/>
    </div>
  )
}