import React from "react";
import { Input, Sheet } from "zmp-ui";

import { StyleUtils } from "utils";
import { useAppContext, useBeanObserver, useNotification, useFamilyTree } from "hooks";

interface HallOfFameForm {
  id: number;
  name: string;
  description: string;
}

interface UICreateHallOfFameProps {
  visible: boolean;
  onClose: () => void;
  onReloadParent?: () => void
}
export function UICreateHallOfFame(props: UICreateHallOfFameProps) {
  const { visible, onClose, onReloadParent } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, successToast } = useNotification();
  const { processor, loading, error, refresh } = useFamilyTree();

  const observer = useBeanObserver({} as HallOfFameForm);

  const onCreate = () => {

  }

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      height={StyleUtils.calComponentRemainingHeight(0)}
    >
      <div className="flex-v">
      </div>
    </Sheet>
  );
}