import React from "react";
import { t } from "i18next";
import { Sheet, Grid, Button, useNavigate, Stack } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse, FamilyTreeUtils, EFamilyTreeApi } from "utils";
import { Header, Loading, CommonIcon, TreeNode, FamilyTree, TreeConfig } from "components";
import { Node } from "components/tree-relatives/types";

/** @deprecated */
export function UIFamilyTreeDeprecated() {
  const phoneNumber = useRecoilValue(phoneState);
  const navigate = useNavigate();

  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ reload, setReload ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);

  const showMemberDetail = () => {
    setSelectId("");
    const data = {
      memberId: selectId,
      phoneNumber: phoneNumber,
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

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      setLoading(false);
      setResetBtn(false);
      if (typeof result === 'string') {
        console.warn(result);
      } else {
        const data = result["members"] || null;
        const mems: Node[] = FamilyTreeUtils.remapServerData(data);
        setFamilyMembers(FamilyTreeUtils.removeDuplicates(mems));
        setRootId(`${data.id}`);
      }
    }
    const fail = (error: FailResponse) => {
      setLoading(false);
      console.error(error.stackTrace);
    } 

    EFamilyTreeApi.getMembers(phoneNumber, success, fail);
  }, [ reload ])

  const renderTree = () => {
    if (!loading) {
      return (
        <div className="tree-container">
          {renderResetTree()}

          <FamilyTree
            nodes={familyMembers as any}
            rootId={rootId}
            nodeHeight={TreeConfig.nodeHeight}
            nodeWidth={TreeConfig.nodeWidth}
            searchFields={["id", "name"]}
            renderNode={(node: any) => (
              <TreeNode
                key={node.id}
                node={node}
                displayField="name"
                isRoot={node.id === rootId}
                onSelectNode={(id) => { setSelectId(id) }}
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
        </div>
      );
    } else {
      return <Loading message={t("loading_family_tree")}/>;
    }
  }

  const renderResetTree = () => {
    if (resetBtn) {
      return (
        <Button size="small" onClick={() => {
          setFamilyMembers([]);
          setRootId("");
          setReload(!reload)}
        }>
          {t("reset")}
        </Button>
      )
    } else return null;
  }

  return (
    <div>
      <Header title={t("family_tree")}/>

      {renderTree()}
    </div>
  )
}

export function UIFamilyTree() {
  const phoneNumber = useRecoilValue(phoneState);

  let [ members, setMembers ] = React.useState<any[]>([]);
  let [ rootId, setRootId ] = React.useState<string>("");

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
  }, [ ])
  return (
    <React.Suspense>
      <UIFamilyTreeContainer 
        nodes={members}
        rootId={rootId}
        phoneNumber={phoneNumber}
      />
    </React.Suspense>
  )
}

interface UIFamilyTreeContainerProps {
  nodes: any[];
  rootId: string;
  phoneNumber: any;
}
export function UIFamilyTreeContainer(props: UIFamilyTreeContainerProps) { 
  const navigate = useNavigate();

  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>(props.nodes);
  const [ rootId, setRootId ] = React.useState<string>(props.rootId);
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ reload, setReload ] = React.useState(false);

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

  const ResetTree = () => {
    if (resetBtn) {
      return (
        <Button 
          className="p-2"
          size="small" 
          onClick={() => {
            setFamilyMembers([]);
            setRootId("");
            setReload(!reload)}
          }
        >
          {t("reset")}
        </Button>
      )
    } else return null;
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

  const Tree = () => {
    return (
      <div className="tree-container">
        <ResetTree/>

        <FamilyTree
          nodes={familyMembers as any[]}
          rootId={rootId}
          nodeHeight={TreeConfig.nodeHeight}
          nodeWidth={TreeConfig.nodeWidth}
          searchFields={["id", "name"]}
          renderNode={(node: any) => (
            <TreeNode
              key={node.id}
              node={node}
              displayField="name"
              isRoot={node.id === rootId}
              onSelectNode={(id) => { setSelectId(id) }}
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