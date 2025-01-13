import React from "react";
import { ToastContainer, ToastOptions, Flip, toast } from "react-toastify";

type ToastContent = string | React.ReactNode;

export type NotificationCtx = {
  successToast: (content: string | React.ReactNode) => void;
  dangerToast: (content: string | React.ReactNode) => void;
  warningToast: (content: string | React.ReactNode) => void;
}

export const NotificationContext = React.createContext({
  successToast(content) {
    console.warn("successToast is not implemented")
  },
  dangerToast(content) {
    console.warn("dangerToast is not implemented")
  },
  warningToast(content) {
    console.warn("warningToast is not implemented")
  }
} as NotificationCtx);


// ================================
// Provider
// ================================
interface NotificationProviderProps {
  children: React.ReactNode;
}
export function NotificationProvider(props: NotificationProviderProps) {
  const { children } = props;

  const ctx = {
    successToast: successToast,
    dangerToast: dangerToast,
    warningToast: warningToast
  } as NotificationCtx;

  return (
    <NotificationContext.Provider value={ctx}>
      {children}
      <ToastContainer/>
    </NotificationContext.Provider>
  )
}

// ================================
// Private
// ================================
function createToastConfig() {
  return {
    autoClose: 3000,
    hideProgressBar: true,
    pauseOnFocusLoss: false,
    position: "top-center",
    transition: Flip,
    draggable: true,
    draggableDirection: "x",
    style: {
      width: "95vw"
    }
  } as ToastOptions;
}

function successToast(content: ToastContent) {
  toast.success(content, createToastConfig());
}

function dangerToast(content: ToastContent) {
  toast.error(content, createToastConfig());
}

function warningToast(content: ToastContent) {
  toast.warning(content, createToastConfig());
}