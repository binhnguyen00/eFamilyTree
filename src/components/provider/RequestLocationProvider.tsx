import React from "react";

import { useAppContext } from "hooks";
import { RequestLocation } from "components";

export type RequestLocationCtx = {
  needLocation: boolean,
  requestLocation: () => void;
}

export const RequestLocationContext = React.createContext({} as RequestLocationCtx);

export function useRequestLocationContext() {
  return React.useContext(RequestLocationContext);
}

export function RequestLocationProvider({ children }: { children: React.ReactNode }) {
  const { logedIn, zaloUserInfo } = useAppContext();
  const { "scope.userLocation": locationPermission } = zaloUserInfo.authSettings;

  const [ requestLocation, setRequestLocation ] = React.useState<boolean>(false);
  const [ needRequest, setNeedRequest ] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!locationPermission) setNeedRequest(true);
    else setNeedRequest(false);
  }, [ logedIn, zaloUserInfo ])

  const sentRequest = () => {
    if (needRequest) setRequestLocation(true);
    else setRequestLocation(false);
  }

  const context = {
    needLocation: needRequest,
    requestLocation: sentRequest,
  } as RequestLocationCtx;

  return (
    <RequestLocationContext.Provider value={context}>
      {children}

      <RequestLocation 
        visible={requestLocation} 
        onClose={() => setRequestLocation(false)}        
      />
    </RequestLocationContext.Provider>
  )
}