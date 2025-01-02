import React from "react";
import { t } from "i18next";
import { Box, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { useAppContext, useRouteNavigate } from "hooks";

export function Navigation() {
  const { appId } = useAppContext();
  const { currentPath } = useRouteNavigate();
  const NO_BOTTOM_NAVIGATION_PAGES = [`/zapps/${appId}/family-tree`, "/dev/tree"];

  const noBottomNav = React.useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(currentPath);
  }, [currentPath]);
  if (noBottomNav) return null;


  return (
    <div className="nav-bar flex-h">
      <NavItem
        path={`/zapps/${appId}`}
        label={t("home")}
        icon={<CommonIcon.Home size={24}/>}
        activeIcon={<CommonIcon.Home size={32} className="text-tertiary"/>}
      /> 
      <NavItem
        className="nav-item special"
        path={`family-tree`}
        label={""}
        icon={<CommonIcon.Tree size={40}/>}
        activeIcon={null}
      /> 
      <NavItem
        path={`account`}
        label={t("account")}
        icon={<CommonIcon.User size={24}/>}
        activeIcon={<CommonIcon.User size={32} className="text-tertiary"/>}
      /> 
    </div>
  );
}  

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  className?: string;
}
function NavItem(props: NavItemProps) {
  const { path, label, icon, activeIcon, className = "" } = props;
  const { rootPath, currentPath, goTo, goHome, createPath } = useRouteNavigate();
  const isActive = currentPath === createPath(path);

  const handleNavigate = () => {
    if (path === rootPath) {
      goHome(); 
    } else {
      goTo(path, true);
    }
  }

  return (
    <>
      <Box 
        className={`center text-primary button ${className}`}
        flex flexDirection="column" justifyContent="center"
        onClick={handleNavigate}
      >
        {isActive ? activeIcon || icon : icon}
        <Text.Title size={"small"}>
          {label}
        </Text.Title>
      </Box>
    </>
  )
}