import React from "react";
import { t } from "i18next";
import { Box, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { useAccountContext, useAppContext, useRequestPhoneContext, useRouteNavigate } from "hooks";

function useDefaultPath() {
  const { appId } = useAppContext();
  const { currentPath, goTo, jumpTo } = useRouteNavigate();
  const defaultPath = `/zapps/${appId}/`;

  React.useEffect(() => {
    if (currentPath === "/") {
      jumpTo({ path: defaultPath });
    }
  }, [ currentPath ]);
}

export function Navigation() {
  const { appId } = useAppContext();
  const { currentPath, rootPath } = useRouteNavigate();
  useDefaultPath();

  const REMOVE_NAVIGATION = [
    // MAIN ROUTES
    `/zapps/${appId}/family-tree`, 
    `/zapps/${appId}/family-tree/biography`, 
    `/zapps/${appId}/gallery`, 
    `/zapps/${appId}/gallery/images`, 
    `/zapps/${appId}/gallery/album`, 
    `/zapps/${appId}/calendar`, 
    `/zapps/${appId}/calendar/month`, 
    `/zapps/${appId}/social-posts`, 
    `/zapps/${appId}/social-posts/detail`, 
    `/zapps/${appId}/funds`, 
    `/zapps/${appId}/fund/info`, 
    `/zapps/${appId}/register`, 
    `/zapps/${appId}/register/clan`, 
    `/zapps/${appId}/theme`, 
    `/zapps/${appId}/hall-of-fame`, 
    `/zapps/${appId}/hall-of-fame/users`, 
    `/zapps/${appId}/ritual-script`, 
    `/zapps/${appId}/memorial-location`, 
    // DEMO ROUTES
    `/zapps/${appId}/dev/tree`,
    `/zapps/${appId}/dev/playground`,
  ];

  const noBottomNav = React.useMemo(() => {
    return REMOVE_NAVIGATION.includes(currentPath);
  }, [currentPath]);
  
  if (noBottomNav) return null;

  return (
    <div className="nav-bar flex-h">
      <NavItem
        path={rootPath}
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