import React from "react";
import { ToastContainer, ToastOptions, Flip, toast } from "react-toastify";


// ================================
// Provider
// ================================
type ToastContent = string | React.ReactNode;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const ctx = {
    successToast: successToast,
    dangerToast: dangerToast,
    warningToast: warningToast,
    infoToast: infoToast
  } as NotificationCtx;

  return (
    <NotificationContext.Provider value={ctx}>
      {children}
      <ToastContainer/>
    </NotificationContext.Provider>
  )
}

export type NotificationCtx = {
  successToast: (content: ToastContent) => void;
  dangerToast: (content: ToastContent) => void;
  warningToast: (content: ToastContent) => void;
  infoToast: (content: ToastContent) => void;
}

export const NotificationContext = React.createContext({
  successToast: () => console.warn("successToast is not implemented"),
  dangerToast: () => console.warn("dangerToast is not implemented"),
  warningToast: () => console.warn("warningToast is not implemented"),
  infoToast: () => console.warn("infoToast is not implemented")
} as NotificationCtx);

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

function infoToast(content: ToastContent) {
  toast.info(content, createToastConfig())
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