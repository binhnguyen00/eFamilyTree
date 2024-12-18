import React from "react";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Text } from "zmp-ui";

import { CommonIcon } from "components";
import { useAppContext } from "hooks";

export function Navigation() {
  const { appId } = useAppContext();
  const location = useLocation();
  const NO_BOTTOM_NAVIGATION_PAGES = ["/family-tree", "/dev/tree"];

  const noBottomNav = React.useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);
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
        path="/family-tree"
        label={""}
        icon={<CommonIcon.Tree size={40}/>}
        activeIcon={null}
      /> 
      <NavItem
        path="/user"
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
  let { path, label, icon, activeIcon, className = "" } = props;

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname.includes(path) || location.pathname === path;

  return (
    <>
      <Box 
        className={`center text-primary button ${className}`}
        flex flexDirection="column" justifyContent="center"
        onClick={() => navigate(path) }
      >
        {isActive ? activeIcon || icon : icon}
        <Text.Title size={"small"}>
          {label}
        </Text.Title>
      </Box>
    </>
  )
}