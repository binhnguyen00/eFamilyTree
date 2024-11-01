import React from "react";
import ReactFamilyTree from 'react-family-tree';
import { useTranslation } from "react-i18next";
import { TiZoomInOutline, TiZoomOutOutline } from "react-icons/ti";
import { CgUndo } from "react-icons/cg";
import { BiHorizontalCenter } from "react-icons/bi";
import { Box, Button, Modal, Text, BottomNavigation, Page, Stack } from "zmp-ui";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";

import { FamilyMember, Node } from "../../components/tree/Node";
import { CommonComponentUtils } from "../../utils/CommonComponent";
import { EFamilyTreeApi } from "../../utils/EFamilyTreeApi";
import { FamilyTreeUtils as FTreeUtils, NODE_HEIGHT, NODE_WIDTH } from "./FamilyTreeUtils";
import { NodeDetails } from "../../components/tree/NodeDetails";
import { PhoneNumberContext } from "../../pages/main";
import { t } from "i18next";

export function UIFamilyTree() {
  const { t } = useTranslation();
  const phoneNumber = React.useContext(PhoneNumberContext);

  const [ familyMembers, setFamilyMembers ] = React.useState<any[]>([]);
  const [ rootId, setRootId ] = React.useState<string>("");
  const [ selectId, setSelectId ] = React.useState<string>("");
  const [ fetchError, setFetchError ] = React.useState(false);
  const [ loading, setLoading ] = React.useState(true);
  const [ reload, setReload ] = React.useState(false);

  React.useEffect(() => {
    
    const success = (res: any) => {
      setLoading(false);
      if (typeof res === 'string') {
        setFetchError(true);
      } else {
        const data = res["employee_tree"];
        if (data) {
          let result: FamilyMember[] = FTreeUtils.processServerData(data);
          setFamilyMembers(result);
          setRootId(`${data.id}`);
        }
      }
    }

    const fail = (error: any) => {
      setLoading(false);
      setFetchError(true);
    }

    const fetchData = () => {
      setLoading(true);
      setFetchError(false);
      EFamilyTreeApi.getMembers(phoneNumber, success, fail);
    }

    fetchData();
  }, [ reload, phoneNumber ]);

  return (
    <Page>
      {CommonComponentUtils.renderHeader(t("family_tree"))}

      {loading ? (
        <Box flex flexDirection="column" alignItems="center">
          <Text.Title size="small">{t("loading_family_tree")}</Text.Title>
        </Box>
      ) : fetchError ? (
        <Stack space="1rem">
          <Text.Title size="small">{t("server_error")}</Text.Title>
          <Button size="small" onClick={() => setReload((prev) => !prev)}>
            {t("retry")}
          </Button>
        </Stack>
      ) : familyMembers.length > 0 ? (
        <div className="container">
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
            actions={[ { text: t("close"), close: true } ]}
          >
            <NodeDetails nodeId={selectId}/>
          </Modal>
        </div>
      ) : (
        <Box flex flexDirection="column" justifyContent="center" alignItems="center">
          <Text.Title size="small">{t("no_family_tree")}</Text.Title>
          <Button size="small" onClick={() => setReload((prev) => !prev)}>
            {t("retry")}
          </Button>
        </Box>
      )}
    </Page>
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