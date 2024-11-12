import React from "react";
import { t } from "i18next";
import { Box, Spinner, Text, Stack, Button } from "zmp-ui";

export class CommonComponentUtils {
  public static renderLoading(message: string) {
    return (
      <Box flex flexDirection="column" justifyContent="center" alignItems="center">
        <Spinner visible/>
        <Text.Title style={{
          textTransform: "capitalize",
        }} size="small"> {message} </Text.Title>
      </Box>
    )
  }

  public static renderError(message: string, onRetry?: () => void) {
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

  public static renderRetry(message: string, onRetry?: () => void) {
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
}