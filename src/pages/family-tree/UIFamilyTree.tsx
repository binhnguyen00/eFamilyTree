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

  let [ members, setMembers ] = React.useState<any[]>([
    {
      name: t("family_member"), id: "", gender: Gender.male, avatar: "",
      parents: [], siblings: [], spouses: [], children: []
    }
  ]);
  let [ rootId, setRootId ] = React.useState<string>("");
  let [ reload, setReload ] = React.useState(false);
  let [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      setLoading(false);
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
      setLoading(false);
      console.error(error.stackTrace);
    } 

    EFamilyTreeApi.getMembers(phoneNumber, success, fail);
  }, [ reload, phoneNumber ]);

  if (loading) return (
    <div className="container">
      <Header title={t("family_tree")} />
      <Loading message={t("loading_family_tree")} />      
    </div>
  ) 
  else return (
    <UIFamilyTreeContainer 
      nodes={members}
      rootId={rootId}
      phoneNumber={phoneNumber}
      onReload={() => setReload(!reload)}
    />
  )
}

interface UIFamilyTreeContainerProps {
  nodes: any[];
  rootId: string;
  phoneNumber: any;
  onReload?: () => void;
}
export function UIFamilyTreeContainer(props: UIFamilyTreeContainerProps) { 
  const navigate = useNavigate();

  const [ members, setMembers ] = React.useState<any[]>(props.nodes);
  const [ rootId, setRootId ] = React.useState<string>(props.rootId);
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    setMembers(props.nodes);
    setRootId(props.rootId);
  }, [ reload ]);

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
    const treeBranch = FamilyTreeUtils.getTreeBranch(selectId, props.nodes);
    setMembers(treeBranch);
    setRootId(selectId);
    setResetBtn(true);
  }

  const Tree = () => {

    const onReset = resetBtn ? () => {
      setReload(!reload);
      setResetBtn(false);
    } : undefined;

    return (
      <>
        <FamilyTree
          nodes={members}
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

        <Sheet
          visible={selectId !== ""}
          onClose={() => { setSelectId("") }}
          autoHeight
          handler
          swipeToClose
          title={`${FamilyTreeUtils.getMemberById(selectId, props.nodes)?.name || t("member_info")}`}
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
      </>
    );
  }

  return (
    <div className="tree-container">
      <Header title={t("family_tree")}/>

      <Tree/>
    </div>
  )
}