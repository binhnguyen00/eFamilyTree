import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { Box, Button, Modal, Text, BottomNavigation, Page } from "zmp-ui";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { FamilyMember, Node } from "../../components/tree/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { FamilyTreeUtils as FTreeUtils, NODE_HEIGHT, NODE_WIDTH } from "./FamilyTreeUtils";
import { NodeDetails } from "../../components/tree/NodeDetails";

export function UIFamilyTree() {
  const [ reload, setReload ] = React.useState(false);
  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (res: any) => {
      const data = res["employee_tree"];
      if (data) {
        let result: FamilyMember[] = FTreeUtils.processServerData(data);
        setFamilyMembers(result);
        setRootId(`${data.id}`);
      }
    }
    const fail = (error: any) => {
      setFetchError(!fetchError);
    }
    // TODO: Replace with actual phone number. Use Provider.
    EFamilyTreeApi.getMembers(import.meta.env.VITE_DEV_PHONE_NUMBER as string, success, fail);
  }, [ reload, fetchError ]);

  return (
    <Page className="page" style={{ marginTop: 44 }}>
      {CommonComponentUtils.renderHeader("Family Tree")}

      {familyMembers.length > 0 ? (
        <>
          <TransformWrapper centerOnInit minScale={0.01}>
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
              <>
                <TransformComponent>
                  <ReactFamilyTree
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
                        style={FTreeUtils.calculateNodePosition(node)}
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
            actions={[ { text: "Close", close: true } ]}
          >
            <NodeDetails nodeId={selectId}/>
          </Modal>

        </>
      ) : (
        <React.Fragment>
            {fetchError ? (
              <Box flex flexDirection="column" justifyContent="center">
                <Text.Title>{"Something went wrong"}</Text.Title> 
                <Button onClick={() => setReload(!reload)}>{"Retry"}</Button>
              </Box>
            ) : (
              <Box flex justifyContent='center'> 
                <Text.Title>{"Getting members..."}</Text.Title> 
              </Box>
            )}
        </React.Fragment>
      )}
    </Page>
  )
}

function UITreeControl() {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <BottomNavigation
      fixed
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
        label={"Center"}
        icon={<BiHorizontalCenter/>}
        onClick={() => centerView()}
      />
      <BottomNavigation.Item
        key="reset"
        label={"Reset"}
        icon={<CgUndo/>}
        onClick={() => resetTransform()}
      />
    </BottomNavigation>
  )
}