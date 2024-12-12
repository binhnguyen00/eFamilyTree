import React from "react";
import { t } from "i18next";
import { Sheet, Grid, Button, Box, Input } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse, FamilyTreeUtils, EFamilyTreeApi, CommonUtils } from "utils";
import { ServerResponse } from "utils/type";
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
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error("UIFamilyTree:\n\t", result.message);
      } else {
        // TODO: re-write logic, cuz server has changed
        const data = result.data as any;
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
  // tree
  const [ members, setMembers ] = React.useState<any[]>(props.nodes);
  const [ rootId, setRootId ] = React.useState<string>(props.rootId);
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState(false);

  // member
  const [ memberInfo, setMemberInfo ] = React.useState<any>(null);

  React.useEffect(() => {
    setMembers(props.nodes);
    setRootId(props.rootId);
  }, [ reload ]);

  const showMemberDetail = () => {
    setSelectId("");
    const success = (result: any) => {
      const info = result.info || null;
      setMemberInfo(info);
    }
    const fail = (error: FailResponse) => {
      console.error(error.stackTrace);
    } 
    const memberId: number = +selectId;
    EFamilyTreeApi.getMemberInfo(props.phoneNumber, memberId, success, fail);
  }

  const renderTreeBranch = () => {
    setSelectId("");
    const treeBranch = FamilyTreeUtils.getTreeBranch(selectId, props.nodes);
    setMembers(treeBranch);
    setRootId(selectId);
    setResetBtn(true);
  }

  const treeContainer = () => {

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
          searchDisplayField="name"
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
      </>
    );
  }

  return (
    <div className="tree-container">
      <Header title={t("family_tree")}/>
      
      {treeContainer()}

      {!CommonUtils.isStringEmpty(selectId) && (
        <UITreeOptions
          visible={!CommonUtils.isStringEmpty(selectId)}
          title={`${FamilyTreeUtils.getMemberById(selectId, props.nodes)?.name || t("member_info")}`}
          onClose={() => { setSelectId("") }}
          showMemberDetail={showMemberDetail}
          renderTreeBranch={renderTreeBranch}
        />
      )}

      {!CommonUtils.isNullOrUndefined(memberInfo) && (
        <UIMemberDetail
          visible={!CommonUtils.isNullOrUndefined(memberInfo)} 
          info={!CommonUtils.isNullOrUndefined(memberInfo) && memberInfo}
          onClose={() => { setMemberInfo(null) }}
        />
      )}
    </div>
  )
}

interface UITreeOptionsProps {
  visible: boolean;
  onClose: () => void;
  showMemberDetail: () => void;
  renderTreeBranch: () => void;
  title?: string;
}
function UITreeOptions(props: UITreeOptionsProps) {
  const { visible, onClose, showMemberDetail, renderTreeBranch, title } = props;
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      mask
      autoHeight
      handler
      swipeToClose
      title={title}
    >
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
    </Sheet>
  )
}

interface UIMemberDetailProps {
  visible: boolean;
  info: any;
  onClose: () => void;
}
function UIMemberDetail(props: UIMemberDetailProps) {
  const { visible, info, onClose } = props;

  return (
    <Sheet
      visible={visible} mask autoHeight handler swipeToClose
      onClose={onClose} 
      title={info["name"] || t("member_info")}
    >
      <Box className="p-2" style={{ maxHeight: "50vh" }}>
        <Input label={"Họ Tên"} value={info["name"]} />
        <Input label={"Điện thoại"} value={info["phone"]} />
        <Input label={"Bố"} value={info["bo"]} />
        <Input label={"Mẹ"} value={info["me"]} />
        <Input label={"Ngành/Chi"} value={info["nganh_chi"]} />
      </Box>
    </Sheet>
  )
}