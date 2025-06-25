import classNames from "classnames";
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
      <ToastContainer />
    </NotificationContext.Provider>
  )
}

export type NotificationCtx = {
  successToast: (content: ToastContent) => void;
  dangerToast: (content: ToastContent) => void;
  warningToast: (content: ToastContent) => void;
  infoToast: (content: ToastContent) => void;
  loadingToast: ({
    content,
    operation
  }: {
    content: ToastContent,
    operation: (
      onSuccess: (successMessage: ToastContent) => void,
      onFail: (errorMessage: ToastContent) => void,
      onDismiss: () => void
    ) => void
  }) => void;
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
enum ConfigType {
  SUCCESS = "success",
  DANGER = "error",
  WARNING = "warning",
  INFO = "info",
}

function createToastConfig(type: ConfigType) {
  let textColor: string;
  switch (type) {
    case ConfigType.SUCCESS:
      textColor = "text-green-900";
      break;
    case ConfigType.DANGER:
      textColor = "text-red-900";
      break;
    case ConfigType.WARNING:
      textColor = "text-yellow-900";
      break;
    case ConfigType.INFO:
      textColor = "text-base";
      break;
  }
  return {
    autoClose: 3000,
    hideProgressBar: true,
    pauseOnFocusLoss: false,
    position: "top-center",
    transition: Slide,
    draggable: true,
    draggablePercent: 50,
    draggableDirection: "x",
    style: {
      width: "95vw",
      marginTop: 15,
      fontSize: "1rem"
    },
    className: classNames("rounded box-shadow py-3", textColor)
  } as ToastOptions;
}

function infoToast(content: ToastContent) {
  toast.info(content, createToastConfig(ConfigType.INFO))
}

function successToast(content: ToastContent) {
  toast.success(content, createToastConfig(ConfigType.SUCCESS));
}

function dangerToast(content: ToastContent) {
  toast.error(content, createToastConfig(ConfigType.DANGER));
}

function warningToast(content: ToastContent) {
  toast.warning(content, createToastConfig(ConfigType.WARNING));
}

function loadingToast({
  content,
  operation,
}: {
  content: ToastContent,
  operation: (
    onSuccess: (render: ToastContent) => void,
    onFail: (render: ToastContent) => void,
    onDismiss: () => void
  ) => void,
}) {
  const config = createToastConfig(ConfigType.INFO)
  const toastId = toast.loading(content, config);

  const success = (render: ToastContent): void => {
    toast.update(toastId, {
      render: render,
      type: ConfigType.SUCCESS,
      isLoading: false,
      ...createToastConfig(ConfigType.SUCCESS),
    });
  };

  const fail = (render: ToastContent): void => {
    toast.update(toastId, {
      render: render,
      type: ConfigType.DANGER,
      isLoading: false,
      ...createToastConfig(ConfigType.DANGER),
    });
  };

  const dismiss = () => {
    toast.dismiss(toastId);
  }

  operation(success, fail, dismiss);
}