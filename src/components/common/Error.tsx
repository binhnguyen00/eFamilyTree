import React from "react";
import { t } from "i18next";
import { Text, Stack, Button } from "zmp-ui";

interface UIErrorProps {
  message: string;
  onRetry: () => void;
}

export default function Error(props: UIErrorProps) {
  const { message, onRetry } = props;
  return (
    <Stack space="0.5rem" style={{
      textTransform: "capitalize"
    }} className="center">
      <Text.Title size="normal"> {message} </Text.Title>
      {onRetry && (
        <Button
          size="small" onClick={onRetry}
        > {t("retry")} </Button>
      )}
    </Stack>
  )
}