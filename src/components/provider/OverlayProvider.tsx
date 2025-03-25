import React from "react";
import { t } from "i18next";
import { Modal } from "zmp-ui";

import { OverlayCtx } from "types/overlay-context";
import { UIAbout } from "pages/about/UIAbout";

export const OverlayContext = React.createContext({} as OverlayCtx);
export function useOverlayContext() { return React.useContext(OverlayContext) }

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [ isOpen, setIsOpen ] = React.useState<boolean>(false);

  const [ title, setTitle ] = React.useState<string>(t("Chào mừng đến với Gia Phả Lạc Hồng"));
  const [ description, setDescription ] = React.useState<string>("");
  const [ content, setContent ] = React.useState<React.ReactNode>(<div> {t("greeting")} </div>);
  const [ className, setClassName ] = React.useState<string>("");

  const onOpen = ({ title, content, description, className }: { 
    title: string, 
    description: string,
    content: React.ReactNode,
    className: string
  }) => {
    setTitle(title);
    setContent(content);
    setDescription(description);
    setClassName(className);
    setIsOpen(true);
  }

  const onClose = () => setIsOpen(false);

  const greetings = () => {
    onOpen({
      title: t(""),
      description: t(""),
      content: <UIAbout/>,
      className: "text-base bg-quaternary"
    });
  }

  const context: OverlayCtx = {
    isOpen: isOpen,
    open: onOpen,
    close: onClose,
    greetings: greetings,
  };

  return (
    <OverlayContext.Provider value={context}>
      <Modal
        visible={isOpen} mask maskClosable modalClassName={className}
        title={title} description={description}
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