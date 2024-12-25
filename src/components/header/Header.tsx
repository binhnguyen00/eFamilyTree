import React from "react";
import { Box, Stack, Text } from "zmp-ui";

import { CommonIcon } from "components/icon/common-icon";
import { useRouteNavigate } from "hooks";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
  showBackIcon?: boolean;
  customRender?: React.ReactNode;
}

export function Header(props: HeaderProps) {
  const { goBack } = useRouteNavigate();
  let { title, subtitle, showBackIcon, logo, customRender } = props;
  if (showBackIcon === undefined || showBackIcon === null) showBackIcon = true;

  return (
    <Box flex flexDirection="row" justifyContent="flex-start">
      <Box
        style={{ zIndex: 999 }}
        className="zaui-header"
        flex flexDirection="row" justifyContent="flex-start" alignContent="center" alignItems="center"
      >
        {showBackIcon && (
          <CommonIcon.ChevonLeft
            className="button-bounce" size={"1.5rem"} 
            onClick={() => goBack()}
          />
        )}
        {customRender ? customRender : (
          <Box flex flexDirection="row" justifyContent="flex-start" className="flex-h">
            {logo && (logo)}
            <Stack>
              <Text.Title size="small" className="text-capitalize text-shadow">
                {title}
              </Text.Title>
              <Text size="small" className="text-shadow">{subtitle}</Text>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}