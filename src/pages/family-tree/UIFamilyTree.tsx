import React from "react";
import { t } from "i18next";
import { Sheet, Grid, Button, Box, Input } from "zmp-ui";

import { CommonUtils } from "utils";
import { FamilyTreeApi } from "api";
import { useAppContext } from "hooks";
import { ServerResponse, FailResponse } from "server";
import { Header, CommonIcon, TreeNode, FamilyTree, TreeConfig, Loading, AppContext } from "components";

import { TreeUtils } from "./TreeUtils";
import { TreeDataProcessor } from "./TreeDataProcessor";

export function UIFamilyTree() {
  const { phoneNumber } = React.useContext(AppContext);
  let [ reload, setReload ] = React.useState(false);
  let [ loading, setLoading ] = React.useState(true);
  let [ processor, setProcessor ] = React.useState<TreeDataProcessor>(new TreeDataProcessor([]));

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error("UIFamilyTree:\n\t", result.message);
      } else {
        const data = result.data as any;
        const processor = new TreeDataProcessor(data);
        setProcessor(processor);
      }
    }
    const fail = (error: FailResponse) => {
      setLoading(false);
      console.error("UIFamilyTree:\n\t", error.message, "\n", error.stackTrace);
    } 
    FamilyTreeApi.getMembers(phoneNumber, success, fail);
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
  // settings
  const { settings } = useAppContext();

  // tree
  const [ nodes, setNodes ] = React.useState<any[]>(props.nodes);
  const [ rootId, setRootId ] = React.useState<string>(props.rootId);
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState(false);

  // member
  const [ memberInfo, setMemberInfo ] = React.useState<any>(null);

  React.useEffect(() => {
    setNodes(props.nodes);
    setRootId(props.rootId);
  }, [ reload ]);

  const showMemberDetail = () => {
    const success = (result: ServerResponse) => {
      if (result.status === "error") {
        console.error("showMemberDetail:\n\t", result.message);
      } else {
        const data = result.data as any;
        setMemberInfo(data);
      }
    }
    const fail = (error: FailResponse) => {
      console.error("showMemberDetail:\n\t", error.message, "\n", "error.stackTrace");
    } 
    const memberId: number = +selectId;
    FamilyTreeApi.getMemberInfo(props.phoneNumber, memberId, success, fail);
    setSelectId(""); // hide the sheet
  }

  const renderTreeBranch = () => {
    const treeBranch = TreeUtils.getBranch(selectId, props.nodes);
    setNodes(treeBranch);
    setRootId(selectId);
    setResetBtn(true);
    setSelectId(""); // hide the sheet
  }

  const treeContainer = () => {

    const onReset = resetBtn ? () => {
      setReload(!reload);
      setResetBtn(false);
    } : undefined;

    return (
      <>
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
              onSelectNode={(id: string) => setSelectId(id)}
              style={TreeUtils.calculateNodePosition(node)}
            />
          )}
        />
      </>
    );
  }

  let background;
  if (settings.background && !CommonUtils.isStringEmpty(settings.background)) {
    background = {
      backgroundImage: `url(https://giapha.mobifone5.vn${settings.background}) !important`,
    }
  } else background = {
    backgroundColor: `var(--tree-background-color) !important`,
  }

  return (
    <div 
      className="tree-container"
      style={{ ...background }}
    >
      <Header title={t("family_tree")}/>
      
      {treeContainer()}

      {!CommonUtils.isStringEmpty(selectId) && (
        <UITreeOptions
          visible={!CommonUtils.isStringEmpty(selectId)}
          title={`${TreeUtils.getMemberById(selectId, props.nodes)?.name || t("member_info")}`}
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
        <Input label={"Giới tính"} value={info["gender"] === "1" ? t("male") : t("female")} />
        <Input label={"Điện thoại"} value={info["phoneNumber"]} />
        <Input label={"Bố"} value={info["father"]} />
        <Input label={"Mẹ"} value={info["mother"]} />
      </Box>
    </Sheet>
  )
}