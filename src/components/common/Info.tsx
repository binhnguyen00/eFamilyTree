import React from "react";
import { Text } from "zmp-ui";

interface InfoProps {
  title: string;
  message?: string;
}
export function Info(props: InfoProps) {
  return (
    <div className="container">
      <Text.Title> {props.title} </Text.Title>
      {props.message && (
        <Text> {props.message} </Text>
      )}
    </div>
  )
}