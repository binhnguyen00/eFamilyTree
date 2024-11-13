import React from "react";
import { t } from "i18next";
import { BottomNavigation } from "zmp-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { logedInState } from "states";

import CommonIcons from "components/icon/common";
import UIRequestPhone from "./UIRequestPhone";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  requirePhone: boolean;
}

export default function UINavigation() {
  const [ sheetVisible, setSheetVisible ] = React.useState(false); 

  const tabs: Record<string, MenuItem> = {
    "/": {
      label: t("home"),
      icon: <CommonIcons.Home/>,
      activeIcon: <CommonIcons.Home className="text-tertiary"/>,
      requirePhone: false
    },
    "/family-tree": {
      label: t("family_tree"),
      icon: <CommonIcons.Tree/>,
      activeIcon: <CommonIcons.Tree className="text-tertiary"/>,
      requirePhone: true
    },
    "/user": {
      label: t("account"),
      icon: <CommonIcons.User/>,
      activeIcon: <CommonIcons.User className="text-tertiary"/>,
      requirePhone: false
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
    <>
      <BottomNavigation
        fixed
        activeKey={location.pathname}
        onChange={navigate}
      >
        {Object.keys(tabs).map((path: TabKeys) => (
          <BottomNavigation.Item
            className="button text-secondary bold"
            key={path}
            label={tabs[path].label}
            icon={tabs[path].icon}
            activeIcon={tabs[path].activeIcon}
          />
        ))}
      </BottomNavigation>

      <UIRequestPhone visible={sheetVisible} closeSheet={() => setSheetVisible(false)}/>
    </>
  );
}  