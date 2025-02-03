import React from "react";
import { t } from "i18next";
import html2canvas from "html2canvas";
import { Button, Input, Text } from "zmp-ui";

import { ZmpSDK } from "utils";
import { useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Divider, SlidingPanel, SlidingPanelOrient } from "components";

import { UIAncestralOfferingTemplate } from "./UITemplate";

const Label = ({ label }: { label: string }) => <p className="text-primary"> {t(label)} </p>
const Title = ({ label }: { label: string }) => <Text.Title className="text-primary"> {t(label)} </Text.Title>

/** Sớ Lễ Gia Tiên */

export type RitualScriptMember = {
  name?: string;
  birth?: string;
  age?: string;
  address?: string;
}
export type RitualScriptForm = {
  yearCreate?: string;
  monthCreate?: string;
  dayCreate?: string;
  liveAt?: string;
  topDog: RitualScriptMember;
  familyMembers: RitualScriptMember[];
  workshipSeason?: string;
  workshipPlace?: string;
}
export function UIAncestralOfferingForm() {
  const form = {
    topDog: {},
    familyMembers: []
  } as RitualScriptForm;

  const observer = useBeanObserver(form);
  const topDogObserver = useBeanObserver(form.topDog);
  const membersObserver = useBeanObserver(form.familyMembers);

  const { loadingToast } = useNotification();

  const [ preview, setPreview ] = React.useState<boolean>(false);

  const exportPNG = () => {
    loadingToast(
      <div>
        <p> {t("preparing_data")} </p>
        <p> {t("please_wait")} </p>
      </div>,
      (onSuccess, onFail) => {
        const element = document.getElementById('petition-ancestral-offering-letter');
        if (!element) { 
          onFail(t("download_fail")); return;
        };

        html2canvas(element, { 
          width: 1920, 
          height: 1080, 
          windowWidth: 1920, 
          windowHeight: 1080, 
          useCORS: true,
        }).then((canvas) => {
          const base64 = canvas.toDataURL("image/jpg", 70);
          ZmpSDK.saveImageToGallery(
            base64, 
            () => onSuccess(
              <div>
                <p> {t("download_success")} </p>
                <p> {t("check_your_gallery")} </p>
              </div>
            ), 
            () => onFail(t("download_fail"))
          );
        }).catch((err) => {
          console.error("Error exporting to PNG:", err);
          onFail(t("download_fail"));
        })
      }
    )
  }

  return (
    <div className="bg-primary">
      <UIBasicForm observer={observer}/>
      <Divider size={0}/>

      <UIHouseOwnerForm observer={topDogObserver}/>
      <Divider size={0}/>

      <UIFamilyMembersForm observer={membersObserver}/>
      <Divider size={0}/>

      <Button size="medium" variant="secondary" onClick={() => setPreview(true)}>
        {t("preview")}
      </Button>

      <SlidingPanel 
        orient={SlidingPanelOrient.LeftToRight} 
        visible={preview} 
        header={
          <div className="flex-h">
            <Text.Title className="text-center mr-1"> {"Sớ Lễ Gia Tiên"} </Text.Title>
            <CommonIcon.CloudDownload className="button" size={24} onClick={exportPNG}/>
          </div>
        }        
        close={() => setPreview(false)}
      >
        <UIAncestralOfferingTemplate 
          form={{
            ...observer.getBean(),
            topDog: topDogObserver.getBean(),
            familyMembers: membersObserver.getBean()
          }}
        />
      </SlidingPanel>
    </div>
  )
}

function UIBasicForm({ observer } : {
  observer: BeanObserver<RitualScriptForm>, 
}) {
  
  return (
    <div className="flex-v bg-secondary rounded p-3">
      <Title label={t("Thiên Thời")}/>
      <div className="flex-h justify-between">
        <Input 
          style={{ width: "100%" }}
          size="small" placeholder="Giáp Thìn"
          label={<Label label="Năm"/>} 
          value={observer.getBean().yearCreate} 
          onChange={(e) => observer.update("yearCreate", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }}
          size="small" placeholder="Định Sửu"
          label={<Label label="Tháng"/>} 
          value={observer.getBean().monthCreate} 
          onChange={(e) => observer.update("monthCreate", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }}
          size="small" placeholder="Canh Ngọ"
          label={<Label label="Ngày"/>} 
          value={observer.getBean().dayCreate} 
          onChange={(e) => observer.update("dayCreate", e.target.value)}
        />
      </div>
      <div className="flex-h justify-between">
        <Input 
          style={{ width: "100%" }}
          size="small" placeholder="Xuân/Hạ/Thu/Đông"
          label={<Label label="Mùa"/>} 
          value={observer.getBean().workshipSeason} 
          onChange={(e) => observer.update("workshipSeason", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }}
          size="small" placeholder="Tại Gia"
          label={<Label label="Nơi Cúng"/>} 
          value={observer.getBean().workshipPlace} 
          onChange={(e) => observer.update("workshipPlace", e.target.value)}
        />
      </div>
    </div>
  )
}

function UIHouseOwnerForm({ observer }: { 
  observer: BeanObserver<RitualScriptMember>, 
}) {

  return (
    <div className="flex-v bg-secondary rounded p-3">
      <Title label={t("Thí Chủ")}/>
      <div className="flex-v justify-between">
        <Input 
          size="small" placeholder="Nguyễn Năng Bình"
          label={<Label label="Tên"/>} 
          value={observer.getBean().name}
          onChange={(e) =>
            observer.update("name", e.target.value)
          }
        />
        <div className="flex-h">
          <Input 
            style={{ width: "100%" }}
            size="small" placeholder="Canh Thìn"
            label={<Label label="Năm"/>} 
            value={observer.getBean().birth}
            onChange={(e) =>
              observer.update("birth", e.target.value)
            }
          />
          <Input 
            style={{ width: "100%" }}
            size="small" placeholder="25 tuổi"
            label={<Label label="Tuổi"/>} 
            value={observer.getBean().age}
            onChange={(e) =>
              observer.update("age", e.target.value)
            }
          />
        </div>
        <Input.TextArea
          size="medium" placeholder="Hải Phòng Thành, Kiến An Quận, Văn Đẩu Phường, Số 24"
          label={<Label label="Nhà"/>} 
          value={observer.getBean().address}
          onChange={(e) =>
            observer.update("address", e.target.value)
          }
        />
      </div>
    </div>
  )
}

function UIFamilyMembersForm({ observer }: { 
  observer: BeanObserver<RitualScriptMember[]>, 
}) {
  const [people, setPeople] = React.useState<number[]>([]);
  
  const addForm = () => {
    setPeople((prev) => [...prev, prev.length + 1]); // Add a unique ID
  };

  const removeForm = (id: number) => {
    if (people.length === 1) setPeople([]);
    setPeople((prev) => prev.filter((person) => person !== id)); // Remove specific ID
  };

  return (
    <div className="flex-v bg-secondary rounded p-3">
      <div className="flex-h justify-between">
        <Title label={t("Thành Viên")}/>
        <div className="text-primary button">
          <CommonIcon.Plus size={28} onClick={addForm}/>
        </div>
      </div>

      {people.map((person, index) => (
        <div key={person} className="border-primary p-2 mt-3 rounded">
          <div className="flex-h justify-end text-primary">
            <CommonIcon.Minus size={28} onClick={() => removeForm(person)}/>
          </div>
          <div className="flex-v">
            <div className="flex-h">
              <Input 
                style={{ width: "100%" }} size="small"
                label={<Label label={t("name")}/>} 
                value={observer.getBean()[index]?.name || ""}
                onChange={(e) => {
                  observer.push(index, {
                    ...observer.getBean()[index],
                    name: e.target.value
                  })
                }}
              />
            </div>
            <div className="flex-h">
              <Input 
                style={{ width: "100%" }} size="small" placeholder="canh thìn"
                label={<Label label={t("năm")}/>} 
                value={observer.getBean()[index]?.birth || ""}
                onChange={(e) => {
                  observer.push(index, {
                    ...observer.getBean()[index],
                    birth: e.target.value
                  })
                }}
              />
              <Input 
                style={{ width: "100%" }} size="small" placeholder="25 tuổi"
                label={<Label label={t("tuổi")}/>} 
                value={observer.getBean()[index]?.age || ""}
                onChange={(e) => {
                  observer.push(index, {
                    ...observer.getBean()[index],
                    age: e.target.value
                  })
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
