import React from "react";

import { MemorialMapApi } from "api";
import { ServerResponse } from "types/server";
import { Loading, SlidingPanel, SlidingPanelOrient, useAppContext } from "components";

interface UIMemorialLocationProps {
  id: number;
  visible: boolean;
  onClose: () => void;
}
export function UIMemorialLocation({ id, visible, onClose }: UIMemorialLocationProps) {
  const [ container, setContainer ] = React.useState<React.ReactNode>(<Loading/>);

  const { info, loading } = useQueryInfo(id)

  React.useEffect(() => {
    if (!loading) setContainer(
      <SlidingPanel
        orient={SlidingPanelOrient.LeftToRight} 
        visible={visible} 
        className="bg-white pb-3"
        header={"Di Tích"}      
        close={onClose}
      >
        {loading ? <Loading/> : (
          <div style={{ height: "70vh" }}>
            content
          </div>
        )}
      </SlidingPanel>
    )
  }, [ loading, info ])
  
  return container;
}

function useQueryInfo(id: number) {
  const { userInfo } = useAppContext();
  const [ info, setInfo ] = React.useState<any>({});
  const [ loading, setLoading ] = React.useState(true);

  React.useEffect(() => {
    const success = (result: ServerResponse) => {
      setLoading(false);
      if (result.status === "error") {
        console.error(result.message);
      } else {
        const data = result.data as any;
        setInfo(data);
      }
    }
    const fail = (error: any) => setLoading(false);
    MemorialMapApi.get(userInfo.id, userInfo.clanId, id, success, fail)
  }, [ id ]);

  return {
    info: info,
    loading: loading
  }
}