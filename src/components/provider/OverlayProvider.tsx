import React from "react";
import { t } from "i18next";
import { Modal } from "zmp-ui";

import { OverlayCtx } from "types/overlay-context";

export const OverlayContext = React.createContext({} as OverlayCtx);
export function useOverlayContext() { return React.useContext(OverlayContext) }

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false);
  const [ content, setContent ] = React.useState<React.ReactNode>(<div> {t("greeting")} </div>);

  const onOpenWithContent = (content: React.ReactNode) => {
    setContent(content);
    setIsOpen(true);
  }

  const onClose = () => setIsOpen(false);

  const context: OverlayCtx = {
    isOpen: isOpen,
    openWithContent: onOpenWithContent,
    close: onClose,
  };

  return (
    <OverlayContext.Provider value={context}>
      <Modal
        visible={isOpen} mask maskClosable className="text-base"
        title={t("Chào mừng đến với Gia Phả Lạc Hồng")}
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