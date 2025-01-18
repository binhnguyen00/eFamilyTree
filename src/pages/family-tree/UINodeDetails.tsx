import React from "react";
import { t } from "i18next";
import { Box, Button, Input, Text } from "zmp-ui";

import { FamilyTreeApi } from "api";
import { CommonIcon, Loading, SlidingPanel, SlidingPanelOrient, useAppContext } from "components";

import { ServerResponse } from "types/server";

interface UINodeDetailsPanelProps {
  id: string;
  visible: boolean;
  onClose: () => void;
  onSelectBranch?: () => void;
}
export function UINodeDetailsPanel(props: UINodeDetailsPanelProps) {
  const { id, visible, onClose, onSelectBranch } = props;
  const { loading, info } = useGetInfo(id);

  const [ container, setContainer ] = React.useState<React.ReactNode>(<Loading/>);

  const height = "70vh";
  React.useEffect(() => {
    if (!loading) setContainer(
      <SlidingPanel
        orient={SlidingPanelOrient.BottomToTop}
        visible={visible}
        close={onClose}
        className="pb-3"
        header={t("member_info")}
      >
        {loading ? <Loading/> : (
          <Box className="px-2" style={{ height: height }}>
            <React.Fragment>
              <Text.Title className="text-capitalize text-secondary py-2"> {t("info")} </Text.Title>
              <div className="flex-h">
                <Input size="small" label={"Giới tính"} value={info["gender"] === "1" ? t("male") : t("female")} />
                <Input size="small" label={"Điện thoại"} value={info["phone"]} />
              </div>
              <Input size="small" label={"Họ Tên"} value={info["name"]} />
              <Input size="small" label={"Bố"} value={info["father"]} />
              <Input size="small" label={"Mẹ"} value={info["mother"]} />
            </React.Fragment>

            <React.Fragment>
              <Text.Title className="text-capitalize text-secondary py-2"> {t("utilities")} </Text.Title>
              <Button 
                variant="secondary" 
                size="small" 
                prefixIcon={<CommonIcon.Tree size={16}/>}
                onClick={onSelectBranch}
              >
                {t("btn_tree_member_detail")}
              </Button>
            </React.Fragment>
          </Box>
        )}
      </SlidingPanel>
    )
  }, [ loading, info ])
  
  return container;
}

function useGetInfo(id: string) {
  const { userInfo } = useAppContext();
  const [ info, setInfo ] = React.useState<any>({});
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error("UINodeDetailsPanel:\n\t", result.message);
      } else {
        const data = result.data as any;
        setInfo(data);
      }
    }
    const fail = (error: any) => setLoading(false);
    const memberId: number = +id;
    FamilyTreeApi.getMemberInfo(memberId, userInfo.clanId, success, fail);
  }, [ id ]);

  return {
    info: info,
    loading: loading
  }
}