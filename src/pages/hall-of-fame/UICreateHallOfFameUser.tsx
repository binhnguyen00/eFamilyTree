import React from "react";
import { t } from "i18next";
import { Input, Sheet, DatePicker, Button } from "zmp-ui";

import { HallOfFameApi } from "api";
import { ServerResponse } from "types";
import { DateTimeUtils, DivUtils } from "utils";
import { CommonIcon, Selection, SelectionOption, TailSpin } from "components";
import { useAppContext, useBeanObserver, useNotification, useFamilyTree } from "hooks";

import { CreateHallOfFameForm } from "./types";

interface UICreateHallOfFameProps {
  visible: boolean;
  hallOfFameTypeId: number;
  onClose: () => void;
  onReloadParent?: () => void
}
export function UICreateHallOfFame(props: UICreateHallOfFameProps) {
  const { visible, onClose, onReloadParent, hallOfFameTypeId } = props;
  const { userInfo } = useAppContext();
  const { dangerToast, loadingToast } = useNotification();
  const { useSearchFamilyTree } = useFamilyTree();
  const { processor, loading, error, refresh } = useSearchFamilyTree();

  const observer = useBeanObserver({
    typeId: hallOfFameTypeId,
    memberId: 0,
    recognitionDate: "",
    achievement: "",
  } as CreateHallOfFameForm);

  const resetObserver = () => {
    observer.update("memberId", 0);
    observer.update("recognitionDate", "");
    observer.update("achievement", "");
  }

  React.useEffect(() => {
    if (processor.nodes.length === 0) {
      observer.update("memberId", 0);
    } else {
      const rootId: number = parseInt(processor.nodes[0].id);
      observer.update("memberId", rootId);
    }
  }, [ processor ]);

  const onCreate = () => {
    if (!observer.getBean().memberId || observer.getBean().memberId === 0) {
      dangerToast(t("Hãy chọn thành viên"));
      return;
    }
    loadingToast({
      content: <p> {t("Đang thêm thành viên")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        HallOfFameApi.addUserToHallOfFame({
          userId: userInfo.id,
          clanId: userInfo.clanId,
          form: observer.getBean(),
          success: (result: ServerResponse) => {
            if (result.status === "error") {
              dangerToastCB(t("Thêm thành viên thất bại"))
            } else {
              successToastCB(t("Thêm thành viên thành công"))
              if (onReloadParent) onReloadParent();
              resetObserver();
              onClose();
            }
          },
          fail: () => {
            dangerToastCB(t("Thêm thành viên thất bại"))
          }
        })
      }
    })
  }

  const renderSelection = () => {

    const errorSelection = (
      <div className="flex-h">
        <Selection
          options={[]} style={{ width: "100%" }}
          placeHolder={t("Không có thành viên nào")}
          label={t("Chọn thành viên")} field={""} observer={null as any}
        />
        <div className="flex-v justify-end">
          {loading ? (
            <TailSpin width={40} height={40}/>
          ): (
            <CommonIcon.Reload size={"2.3rem"} className="button" onClick={() => refresh()}/>
          )}
        </div>
      </div>
    )

    if (loading) {
      return errorSelection;
    } else if (error) {
      return errorSelection;
    } else if (!processor.nodes.length) {
      return errorSelection;
    } else {
      const mapMembers = () => {
        return processor.nodes.map((node) => {
          return {
            value: node.id,
            label: node.name
          } as SelectionOption;
        }) as SelectionOption[];
      }
      return (
        <Selection
          options={mapMembers()}
          isSearchable
          placeHolder={t("Tìm kiếm thành viên...")}
          label={t("Chọn Thành Viên")} field={"member"} observer={observer}
          onChange={(select: SelectionOption) => observer.update("memberId", select.value)}
        />
      )
    }
  }

  return (
    <Sheet
      title={t("Thêm Thành Viên")}
      visible={visible}
      onClose={onClose}
      height={DivUtils.calculateHeight(0)}
    >
      <div className="flex-v p-3 scroll-v">
        {renderSelection()}
        <DatePicker
          mask maskClosable 
          label={`${t("ngày chứng nhận")}`} title={t("Ngày Chứng Nhận")}
          onChange={(date: Date, pickedValue: any) => {
            observer.update("recognitionDate", DateTimeUtils.formatToDate(date))
          }}
        /> 
        <Input.TextArea
          name="achievement" value={observer.getBean().achievement}
          label={`${t("thành tích đạt được")}`} 
          onChange={(e) => observer.update("achievement", e.target.value)}
        />
        
        <div>
          <Button prefixIcon={<CommonIcon.Save/>} size="small" onClick={onCreate}>
            {t("save")}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}