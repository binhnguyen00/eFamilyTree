import React from "react";
import { t } from "i18next";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { BottomNavigation, Sheet, Grid, Button, Text, ZBox, useNavigate } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import FamilyTree from "../../components/tree/FamilyTree";
import { FailResponse } from "../../utils/Interface";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { CommonComponentUtils } from "../../components/common/CommonComponentUtils";
import { FamilyMember, Node } from "../../components/node/Node";
import { FamilyTreeUtils, NODE_HEIGHT, NODE_WIDTH } from "../../utils/FamilyTreeUtils";

export function UIFamilyTree() {
  const phoneNumber = useRecoilValue(phoneState);
  const navigate = useNavigate();

  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ resetBtn, setResetBtn ] = React.useState<boolean>(false);

  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

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
      setResetBtn(false);
      if (typeof result === 'string') {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        const data = result["members"] || [];
        const mems: FamilyMember[] = FamilyTreeUtils.remapServerData(data);
        setFamilyMembers(FamilyTreeUtils.removeDuplicates(mems));
        setRootId(`${data.id}`);
      }
    }
    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    } 

    EFamilyTreeApi.getMembers(phoneNumber, success, fail);
  }, [ reload ])

  const renderTree = () => {
    if (familyMembers.length > 0) {
      return (
        <div style={{ height: "95%" }}>
          <TransformWrapper centerOnInit minScale={0.01}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent>
                  <FamilyTree
                    nodes={familyMembers as any}
                    rootId={rootId}
                    height={NODE_HEIGHT}
                    width={NODE_WIDTH}
                    renderNode={(node: any) => (
                      <Node
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
            mask
            handler
            swipeToClose
          >
            <Text size="large" className="center"> {
              FamilyTreeUtils.getMemberById(selectId, familyMembers)?.name || ""
            } </Text>
            <ZBox padding="1rem">
              <Grid columnCount={2} columnSpace="0.2rem">
                <Button onClick={showMemberDetail}>
                  {t("btn_tree_member_info")}
                </Button>
                <Button onClick={renderTreeBranch}>
                  {t("btn_tree_member_detail")}
                </Button>
              </Grid>
            </ZBox>
          </Sheet>
        </div>
      );
    } else {
      if (fetchError) {
        return CommonComponentUtils.renderError(t("server_error"), () => setReload(!reload));
      } else {
        return CommonComponentUtils.renderLoading(t("loading_family_tree"));
      }
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
    } else return <></>
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("family_tree"))}

      {renderResetTree()}
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
        key="zoomIn"
        label={"+ Zoom"}
        icon={<TiZoomInOutline/>}
        onClick={() => zoomIn()}
      />
      <BottomNavigation.Item
        key="zoomOut"
        label={"- Zoom"}
        icon={<TiZoomOutOutline />}
        onClick={() => zoomOut()}
      />
      <BottomNavigation.Item
        key="center"
        label={t("center_view")}
        icon={<BiHorizontalCenter/>}
        onClick={() => centerView()}
      />
      <BottomNavigation.Item
        key="reset"
        label={t("reset")}
        icon={<CgUndo/>}
        onClick={() => resetTransform()}
      />
    </BottomNavigation>
  )
}