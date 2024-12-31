import { CommonIcon } from "components/icon";
import React from "react";

interface PanelCloseButtonProps {
  close?: () => void;
}
export function PanelCloseButton(props: PanelCloseButtonProps) {
  const { close } = props;
  if (close) {
    return (
      <CommonIcon.CloseCircle 
        style={{
          position: "fixed",
          right: 1
        }}
        className="button-bounce"
        size={24} onClick={close}
      />
    )
  } else return null;
}