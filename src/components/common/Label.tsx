import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";

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
    <Text style={style} className={classN.trim()}> {`${t(text)} ${required ? "*" : ""}`.trim()} </Text>
  )
}

export function Title({ text, className }: { text: string, className?: string }) {
  return (
    <Text.Title className={`text-center text-primary text-capitalize ${className}`.trim()}>
      {text}
    </Text.Title>
  )
}