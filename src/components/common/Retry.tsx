import React from "react";
import { t } from "i18next";
import { Text, Stack, Button } from "zmp-ui";

interface UIRetryProps {
  message: string;
  onRetry: () => void;
}

export function Retry({ message, onRetry }: UIRetryProps) {
  return (
    <Stack space="0.5rem" style={{
      textTransform: "capitalize"
    }}>
      <Text.Title size="normal"> {message} </Text.Title>
      {onRetry && (
        <Button 
          size="small" onClick={onRetry}
        > {t("retry")} </Button>
      )}
    </Stack>
  )
}