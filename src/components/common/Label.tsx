import React from "react";
import { t } from "i18next";

export function Label({ text, style, className }: { 
  text: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const classN = `${className} text-primary`;
  return (
    <p style={style} className={classN.trim()}> {t(text)} </p>
  )
}
