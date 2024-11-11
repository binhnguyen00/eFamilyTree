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

const tabs: Record<string, MenuItem> = {
  "/home": {
    label: t("home"),
    icon: <FcHome />,
  },
  "/": {
    label: t("family_tree"),
    icon: <FcGenealogy />,
  },
  "/about": {
    label: t("about"),
    icon: <FcInfo />,
  },
};

export type TabKeys = keyof typeof tabs;

function UINavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BottomNavigation
      fixed
      id="footer"
      activeKey={location.pathname}
      onChange={navigate}
      className="z-50"
    >
      {Object.keys(tabs).map((path: TabKeys) => (
        <BottomNavigation.Item
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