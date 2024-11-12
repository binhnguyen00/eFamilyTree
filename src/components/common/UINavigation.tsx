import React from "react";

import { t } from "i18next";

import { FcGenealogy, FcHome, FcInfo } from "react-icons/fc";
import { BottomNavigation } from "zmp-ui";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

function UINavigation() {

  const tabs: Record<string, MenuItem> = {
    "/": {
      label: t("home"),
      icon: <FcHome />,
    },
    "/family-tree": {
      label: t("family_tree"),
      icon: <FcGenealogy />,
    },
    "/about": {
      label: t("about"),
      icon: <FcInfo />,
    },
  };
  type TabKeys = keyof typeof tabs;

  const navigate = useNavigate();
  const location = useLocation();

  const NO_BOTTOM_NAVIGATION_PAGES = ["/family-tree", "/demo-tree"];

  const noBottomNav = React.useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (noBottomNav) return <></>;

  return (
    <BottomNavigation
      fixed
      activeKey={location.pathname}
      onChange={navigate}
    >
      {Object.keys(tabs).map((path: TabKeys) => (
        <BottomNavigation.Item
          className="button"
          key={path}
          label={tabs[path].label}
          icon={tabs[path].icon}
          activeIcon={tabs[path].activeIcon}
        />
      ))}
    </BottomNavigation>
  );
}  

export default UINavigation;