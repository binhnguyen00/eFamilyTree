import React from "react";
import { t } from "i18next";
import { Box, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { useAccountContext, useAppContext, useRequestPhoneContext, useRouteNavigate } from "hooks";

function useDefaultPath() {
  const { appId } = useAppContext();
  const { currentPath, goTo } = useRouteNavigate();
  const defaultPath = `/zapps/${appId}`;

  React.useEffect(() => {
    if (currentPath === "/") {
      goTo({ path: defaultPath, replace: true });
    }
  }, [ currentPath ]);
}

export function Navigation() {
  const { appId } = useAppContext();
  const { currentPath } = useRouteNavigate();

  useDefaultPath();

  const REMOVE_NAVIGATION = [
    `/zapps/${appId}/family-tree`, 
    `/zapps/${appId}/dev/tree`,
  ];

  const noBottomNav = React.useMemo(() => {
    return REMOVE_NAVIGATION.includes(currentPath);
  }, [currentPath]);
  
  if (noBottomNav) return null;

  return (
    <div className="nav-bar flex-h">
      <NavItem
        path={`/`}
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
  const { 
    needRegisterClan, registerClan, 
    needRegisterAccount, registerAccount } = useAccountContext();
  const { needPhone, requestPhone } = useRequestPhoneContext();
  const { rootPath, currentPath, goTo, goHome, createPath } = useRouteNavigate();
  const isActive = currentPath === path || currentPath === createPath(path);

  const onSelectTree = () => {
    if (needPhone) { requestPhone(); return; }
    else if (needRegisterClan) { registerClan(); return; } 
    else if (needRegisterAccount) { registerAccount(); return; }
    else goTo({ path: path, replace: false });
  }

  const handleNavigate = () => {
    if (path === rootPath) { // Home
      goHome(); 
    } else if (path.includes("family-tree")) { 
      onSelectTree(); // Family Tree
    } else { 
      goTo({ path: path, replace: true }); // Account
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