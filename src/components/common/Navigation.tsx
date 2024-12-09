import React from "react";
import { useTranslation } from "react-i18next";
import { Box, Text } from "zmp-ui";
import { useLocation, useNavigate } from "react-router-dom";

import { CommonIcon } from "components/icon/common";
import { RequestPhone } from "./RequestPhone";

export function Navigation() {
  const location = useLocation();
  const NO_BOTTOM_NAVIGATION_PAGES = ["/family-tree", "/demo-tree"];

  const { t } = useTranslation();

  const noBottomNav = React.useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);
  if (noBottomNav) return null;

  console.log(location.pathname);

  return (
    <div className="nav-bar flex-h">
      <NavItem
        path="/"
        label={t("home")}
        icon={<CommonIcon.Home size={24}/>}
        activeIcon={<CommonIcon.Home size={32} className="text-tertiary"/>}
        requirePhone={false}
      /> 
      <NavItem
        path="/family-tree"
        label={t("family_tree")}
        icon={<CommonIcon.Tree size={32}/>}
        activeIcon={<CommonIcon.Tree size={40} className="text-tertiary"/>}
        requirePhone={true}
      /> 
      <NavItem
        path="/user"
        label={t("account")}
        icon={<CommonIcon.User size={24}/>}
        activeIcon={<CommonIcon.User size={32} className="text-tertiary"/>}
        requirePhone={false}
      /> 
    </div>
  );
}  

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  requirePhone: boolean;
  activeIcon?: React.ReactNode;
}
function NavItem(props: NavItemProps) {
  let { path, label, icon, requirePhone, activeIcon } = props;

  const location = useLocation();
  const navigate = useNavigate();
  const [sheetVisible, setSheetVisible] = React.useState(false);

  const isActive = location.pathname === path;

  return (
    <>
      <Box 
        className="center text-primary button"
        flex flexDirection="column" justifyContent="center"
        onClick={() => {
          if (requirePhone) {
            setSheetVisible(true);
          } else {
            navigate(path);
          }
        }}
      >
        {isActive ? activeIcon || icon : icon}
        <Text.Title size={"small"}>
          {label}
        </Text.Title>
      </Box>

      <RequestPhone visible={sheetVisible} closeSheet={() => setSheetVisible(false)}/>
    </>
  )
}