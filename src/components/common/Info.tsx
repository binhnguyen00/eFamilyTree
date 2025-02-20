import React from "react";
import { Text } from "zmp-ui";

interface InfoProps {
  title: string;
  message?: string;
  className?: string;
}
export function Info(props: InfoProps) {
  const { title, message, className } = props;
  return (
    <div className={`center flex-v ${className && className}`.trim()}>
      <Text.Title> {title} </Text.Title>
      {message && (
        <Text> {message} </Text>
      )}
    </div>
  )
}