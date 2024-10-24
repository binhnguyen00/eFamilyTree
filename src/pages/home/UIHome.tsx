import React from "react";
import { Page, Icon, useNavigate, BottomNavigation } from "zmp-ui";

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("ftree");

  const handleTabChange = (key: string) => {
    navigate("/" + key);
  };

  return (
    <Page className="page">
      <BottomNavigation fixed activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <BottomNavigation.Item
          key="ftree"
          label="Family Tree"
          icon={<Icon icon="zi-members" />}
          activeIcon={<Icon icon="zi-members-solid" />}
          onClick={() => handleTabChange("ftree")}
        />
        <BottomNavigation.Item
          label="Danh bạ"
          key="contact"
          icon={<Icon icon="zi-call" />}
          activeIcon={<Icon icon="zi-call-solid" />}
        />
        <BottomNavigation.Item
          label="Khám phá"
          key="discovery"
          icon={<Icon icon="zi-more-grid" />}
          activeIcon={<Icon icon="zi-more-grid-solid" />}
        />
        <BottomNavigation.Item
          key="timeline"
          label="Nhật ký"
          icon={<Icon icon="zi-clock-1" />}
          activeIcon={<Icon icon="zi-clock-1-solid" />}
        />
        <BottomNavigation.Item
          key="me"
          label="Cá nhân"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
        />
      </BottomNavigation>
    </Page>
  );
};

export default HomePage;
