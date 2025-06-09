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
  onBack?: () => void;
}

export function Header(props: HeaderProps) {
  const { title, subtitle, showBackIcon = true, logo, customRender, onBack } = props;
  const { goBack } = useRouteNavigate();

  const styles = { 
    zIndex: 999,
    height: `var(--header-height)`
  } as React.CSSProperties;

  return (
    <div className="zaui-header flex-h justify-start" style={styles}>
      {showBackIcon && (
        <CommonIcon.ChevonLeft
          className="button-bounce" size={"1.5rem"} 
          onClick={onBack ? onBack : () => goBack()}
        />
      )}
      {customRender ? customRender : (
        <div className="flex-h justify-start mt-1">
          {logo && (logo)}
          <div>
            <Text.Title size="small" className="text-capitalize text-shadow">
              {title}
            </Text.Title>
            <Text size="small" className="text-shadow">{subtitle}</Text>
          </div>
        </div>
      )}
    </div>
  )
}