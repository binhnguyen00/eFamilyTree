import React from "react";
import { t } from "i18next";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { BottomNavigation, Sheet, Grid, Button, Text, ZBox, useNavigate, Stack } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import { FailResponse, FamilyTreeUtils, EFamilyTreeApi, TreeConfig } from "utils";
import { Header, Loading, CommonIcon, TreeNode, FamilyTree, FamilyMember } from "components";

export default function UIFamilyTree() {
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
        const mems: FamilyMember[] = FamilyTreeUtils.remapServerData(data);
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
        <div className="tree-container" style={{ width: "100vw", height: "100vh", position: "fixed" }}>
          {renderResetTree()}

          <TransformWrapper 
            minScale={0.1} 
            centerOnInit 
            centerZoomedOut
            initialScale={0.5}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent>
                  <FamilyTree
                    nodes={familyMembers as any}
                    rootId={rootId}
                    height={TreeConfig.height}
                    width={TreeConfig.width}
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
                </TransformComponent>
                
                <UITreeControl />
              </>
            )}
          </TransformWrapper>

          <Sheet
            visible={selectId !== ""}
            onClose={() => { setSelectId("") }}
            autoHeight
            handler
            swipeToClose
          >
            <Stack space="1rem">
              <Text size="large" className="center"> 
                {`${FamilyTreeUtils.getMemberById(selectId, familyMembers)?.name || ""}`} 
              </Text>
              <ZBox padding="1rem">
                <Grid columnCount={2} columnSpace="0.2rem">
                  <Button variant="primary" onClick={showMemberDetail} prefixIcon={<CommonIcon.User size={"1.5rem"}/>}>
                    {t("btn_tree_member_info")}
                  </Button>
                  <Button variant="primary" onClick={renderTreeBranch} prefixIcon={<CommonIcon.Tree size={"1.5rem"}/>}>
                    {t("btn_tree_member_detail")}
                  </Button>
                </Grid>
              </ZBox>
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

export function UITreeControl() {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <BottomNavigation
      fixed activeKey=""
    >
      <BottomNavigation.Item
        key="zoomIn" className="text-primary"
        label={"+ Zoom"}
        icon={<CommonIcon.ZoomIn/>}
        onClick={() => zoomIn()}
      />
      <BottomNavigation.Item
        key="zoomOut" className="text-primary"
        label={"- Zoom"}
        icon={<CommonIcon.ZoomOut/>}
        onClick={() => zoomOut()}
      />
      <BottomNavigation.Item
        key="center" className="text-primary"
        label={t("center_view")}
        icon={<BiHorizontalCenter/>}
        onClick={() => centerView()}
      />
      <BottomNavigation.Item
        key="reset" className="text-primary"
        label={t("reset")}
        icon={<CgUndo/>}
        onClick={() => resetTransform()}
      />
    </BottomNavigation>
  )
}