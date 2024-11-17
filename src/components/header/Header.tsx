import React from "react";
import { Box, Stack, Text, useNavigate } from "zmp-ui";

import CommonIcons from "components/icon/common";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
  showBackIcon?: boolean;
  customRender?: React.ReactNode;
}

export default function Header(props: HeaderProps) {
  const navigate = useNavigate();
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
          <CommonIcons.ChevonLeft
            className="button-bounce" size={"1.5rem"} 
            onClick={() => {
              navigate(-1);
            }}
          />
        )}
        {customRender ? customRender : (
          <Box flex flexDirection="row" justifyContent="flex-start">
            {logo && (logo)}
            <Stack>
              <Text.Title style={{ textTransform: "capitalize" }}>
                {title}
              </Text.Title>
              <Text size="xSmall">{subtitle}</Text>
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}