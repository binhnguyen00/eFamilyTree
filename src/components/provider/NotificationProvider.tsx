import React from "react";
import { ToastContainer } from "react-toastify";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationContext = React.createContext({} as any);

export function NotificationProvider(props: NotificationProviderProps) {
  const { children } = props;
  return (
    <NotificationContext.Provider value={null}>
      {children}
      <ToastContainer/>
    </NotificationContext.Provider>
  )
}