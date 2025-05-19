import React from "react";
import { Text } from "zmp-ui";

interface InfoProps {
  title: string;
  message?: string;
  className?: string;
}
export function Info(props: InfoProps) {
  const { title, message = "", className } = props;
  return (
    <div className={`text-center flex-v flex-grow-0 p-3 text-base ${className && className}`.trim()}>
      {title.length > 0 && <Text.Title> {title} </Text.Title>}
      {message.length > 0 && <Text> {message} </Text>}
    </div>
  )
}