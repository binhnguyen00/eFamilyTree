import React from "react";
import { StyleUtils } from "utils";
import { Text } from "zmp-ui";

interface InfoProps {
  title: string;
  message?: string;
  className?: string;
}
export function Info(props: InfoProps) {
  const { title, message, className } = props;
  return (
    <div className={`text-center flex-v flex-grow-0 p-3 text-base ${className && className}`.trim()}>
      <Text.Title> {title} </Text.Title>
      {message && (
        <Text> {message} </Text>
      )}
    </div>
  )
}