import React from "react";

import { useAppContext } from "hooks";
import { RequestPhone } from "components";

export type RequestPhoneCtx = {
  needPhone: boolean,
  requestPhone: () => void,
}

export const RequestPhoneContext = React.createContext({} as RequestPhoneCtx);

export function RequestPhoneProvider({ children }: { children: React.ReactNode }) {
  const { logedIn, doLogin } = useAppContext();
  const [ requestPhone, setRequestPhone ] = React.useState<boolean>(false);
  const [ needRequest, setNeedRequest ] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!logedIn) setNeedRequest(true);
    else setNeedRequest(false);
  }, [ logedIn ])

  const sentRequest = () => {
    if (needRequest) setRequestPhone(true);
    else setRequestPhone(false);
  }

  const onSuccessRequest = () => doLogin();

  const context = {
    needPhone: needRequest,
    requestPhone: sentRequest,
  } as RequestPhoneCtx;

  return (
    <RequestPhoneContext.Provider value={context}>
      {children}

      <RequestPhone
        visible={requestPhone}
        closeSheet={() => setRequestPhone(false)}
        onSuccessRequest={onSuccessRequest}
      />
    </RequestPhoneContext.Provider>
  )
}