import React from "react";
import { t } from "i18next";

interface LabelProps {
  text: string;
  style?: React.CSSProperties;
  className?: string;
  required?: boolean;
}
export function Label(props: LabelProps) {
  const { text, style, className, required } = props;
  const classN = `${className} text-primary text-capitalize`;
  return (
    <p style={style} className={classN.trim()}> {`${t(text)} ${required ? "*" : ""}`.trim()} </p>
  )
}
