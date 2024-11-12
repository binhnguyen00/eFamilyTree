import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Box, Stack, Text, useNavigate } from "zmp-ui";

interface HeaderProps {
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  showBackIcon?: boolean;
}

export default function UIHeader(props: HeaderProps) {
  const navigate = useNavigate();
  let { title, subtitle, showBackIcon, logo } = props;
  if (showBackIcon === undefined || showBackIcon === null) showBackIcon = true;

  return (
    <Box flex flexDirection="row" justifyContent="flex-start">
      <Box
        className="zaui-header"
        flex flexDirection="row" justifyContent="flex-start" alignContent="center" alignItems="center"
      >
        {showBackIcon && (
          <IoIosArrowBack 
            className="button-bounce" size={"1.5rem"} 
            onClick={() => {
              navigate(-1);
            }}
          />
        )}
        <Box flex flexDirection="row" justifyContent="flex-start">
          {logo && (logo)}
          <Stack>
            <Text.Title style={{ textTransform: "capitalize" }}>
              {title}
            </Text.Title>
            <Text size="xSmall">{subtitle}</Text>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}