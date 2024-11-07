import React from "react";
import { t } from "i18next";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Modal, BottomNavigation } from "zmp-ui";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";

import FamilyTree from "../../components/tree/FamilyTree";
import { FamilyMember, Node } from "../../components/node/Node";
import { CommonComponentUtils } from "../../utils/CommonComponentUtils";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { NodeDetails } from "../../components/node/NodeDetails";
import { FamilyTreeUtils, NODE_HEIGHT, NODE_WIDTH } from "./FamilyTreeUtils";

export function UIFamilyTree() {
  const phoneNumber = useRecoilValue(phoneState);

  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) {
        setFetchError(false);
        let result: FamilyMember[] = FamilyTreeUtils.remapServerData(data);
        setFamilyMembers(result);
        setRootId(`${data.id}`);
      }
    }
    const fail = (error: any) => {
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

          <Modal 
            visible={selectId !== ""}
            onClose={() => { setSelectId(""); }}
            actions={[ { text: t("close"), close: true } ]}
          >
            <NodeDetails nodeId={selectId}/>
          </Modal>
        </div>
      );
    } else {
      if (fetchError) {
        return CommonComponentUtils.renderError(t("server_error"), () => setReload((prev) => !prev));
      } else {
        return CommonComponentUtils.renderLoading(t("loading_family_tree"));
      }
    }
  }

  return (
    <div className="container">
      {CommonComponentUtils.renderHeader(t("family_tree"))}

      {renderTree()}
    </div>
  )
}

function UITreeControl() {
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