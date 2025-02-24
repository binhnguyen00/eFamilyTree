import React from "react";
import { Text } from "zmp-ui";

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
    <div 
      className="zaui-header flex-h justify-start"
      style={{ 
        zIndex: 999,
        height: `var(--header-height)`
      }}
    >
      {showBackIcon && (
        <CommonIcon.ChevonLeft
          className="button-bounce" size={"1.5rem"} 
          onClick={() => goBack()}
        />
      )}
      {customRender ? customRender : (
        <div className="flex-h justify-start">
          {logo && (logo)}
          <div className="flex-v flex-grow-0 text-center">
            <Text.Title size="small" className="text-capitalize text-shadow mt-2">
              {title}
            </Text.Title>
            <Text size="small" className="text-shadow">{subtitle}</Text>
          </div>
        </div>
      )}
    </div>
  )
}