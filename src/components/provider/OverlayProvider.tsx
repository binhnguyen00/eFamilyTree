import React from "react";
import { t } from "i18next";
import { Modal } from "zmp-ui";

import { OverlayCtx } from "types/overlay-context";

export const OverlayContext = React.createContext({} as OverlayCtx);
export function useOverlayContext() { return React.useContext(OverlayContext) }

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false);

  const [ title, setTitle ] = React.useState<string>(t("Chào mừng đến với Gia Phả Lạc Hồng"));
  const [ content, setContent ] = React.useState<React.ReactNode>(<div> {t("greeting")} </div>);

  const onOpen = ({ title, content }: { title: string, content: React.ReactNode }) => {
    setTitle(title);
    setContent(content);
    setIsOpen(true);
  }

  const onClose = () => setIsOpen(false);

  const context: OverlayCtx = {
    isOpen: isOpen,
    open: onOpen,
    close: onClose,
  };

  return (
    <OverlayContext.Provider value={context}>
      <Modal
        visible={isOpen} mask maskClosable className="text-base"
        title={title}
        onClose={onClose}
        actions={[
          { text: t("close"), close: true },
        ]}
      >
        {content}
      </Modal>
      {children}
    </OverlayContext.Provider>
  )
}