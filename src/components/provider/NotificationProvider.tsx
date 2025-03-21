import React from "react";
import { ToastContainer, ToastOptions, Slide, toast } from "react-toastify";


// ================================
// Provider
// ================================
type ToastContent = string | React.ReactNode;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const ctx = {
    successToast: successToast,
    dangerToast: dangerToast,
    warningToast: warningToast,
    infoToast: infoToast,
    loadingToast: loadingToast,
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
  loadingToast: (
    content: ToastContent, 
    operation: (
      onSuccess: (successMessage: ToastContent) => void, 
      onFail: (errorMessage: ToastContent) => void,
      onDismiss: () => void
    ) => void,
  ) => void;
}

export const NotificationContext = React.createContext({
  successToast: () => console.warn("successToast is not implemented"),
  dangerToast: () => console.warn("dangerToast is not implemented"),
  warningToast: () => console.warn("warningToast is not implemented"),
  infoToast: () => console.warn("infoToast is not implemented"),
  loadingToast: () => console.warn("loadingToast is not implemented"),
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
    transition: Slide,
    draggable: true,
    draggablePercent: 60,
    draggableDirection: "x",
    style: {
      width: "95vw",
      marginTop: 5
    },
    className: "rounded"
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

function loadingToast(
  content: ToastContent,
  operation: (
    onSuccess: (successMessage: ToastContent) => void, 
    onFail: (errorMessage: ToastContent) => void,
    onDismiss: () => void
  ) => void,
) {
  const config = createToastConfig()
  const toastId = toast.loading(content, config);

  const success = (successMessage: ToastContent): void => {
    toast.update(toastId, {
      render: successMessage,
      type: "success",
      isLoading: false,
      ...config,
    });
  };

  const fail = (errorMessage: ToastContent): void => {
    toast.update(toastId, {
      render: errorMessage,
      type: "error",
      isLoading: false,
      ...config,
    });
  };

  const dismiss = () => {
    toast.dismiss(toastId);
  }

  operation(success, fail, dismiss);
}