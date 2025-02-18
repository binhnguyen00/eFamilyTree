import React from "react";
import { t } from "i18next";
import html2canvas from "html2canvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button, Input, Sheet, Text } from "zmp-ui";
import { SolarDate } from "@nghiavuive/lunar_date_vi";

import { DateTimeUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, DatePicker, Divider, Label } from "components";

import { UIAncestralOfferingTemplate } from "./UITemplate";

const Title = ({ label }: { label: string }) => <Text.Title className="text-primary"> {t(label)} </Text.Title>

/** Sớ Lễ Gia Tiên */

export type RitualScriptMember = {
  name?: string;
  birth?: string;
  birthDate?: string;
  age?: string;
  address?: string;
}
export type RitualScriptForm = {
  yearCreate?: string;
  monthCreate?: string;
  dayCreate?: string;
  liveAt?: string;
  houseOwner: RitualScriptMember;
  familyMembers: RitualScriptMember[];
  workshipSeason?: string;
  workshipPlace?: string;
}
export function UIAncestralOfferingForm() {
  const { zaloUserInfo } = useAppContext();

  // current solar date
  const calendarDate = DateTimeUtils.toCalendarDate(new Date());
  const solar = new SolarDate(calendarDate);
  const lunar = solar.toLunarDate();
  
  const form = {
    yearCreate: lunar.getYearName(),
    monthCreate: lunar.getMonthName(),
    dayCreate: lunar.getDayName(),
    workshipSeason: lunar.getSolarTerm(),
    houseOwner: {
      name: zaloUserInfo.name,
      birthDate: DateTimeUtils.formatToDate(new Date(2000, 0, 1)),
    },
    familyMembers: []
  } as RitualScriptForm;

  const observer = useBeanObserver(form);
  const houseOwnerObserver = useBeanObserver(form.houseOwner);
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
          onFail(t("download_fail")); 
          return;
        }

        // Get the TransformComponent instance (if needed)
        const transformComponent = document.querySelector('.react-transform-component') as HTMLElement;
        if (!transformComponent) return;

        // Store the current transform state
        const originalTransform = {
          scale: transformComponent.style.transform,
          width: element.style.width,
          height: element.style.height,
        };

        // Reset transformations temporarily
        transformComponent.style.transform = 'none';
        element.style.width = 'auto';
        element.style.height = 'auto';

        html2canvas(element, { 
          useCORS: true,
          width: element.scrollWidth, // Use the content width
          height: element.scrollHeight, // Use the content height
        }).then((canvas) => {
          const base64 = canvas.toDataURL("image/jpg", 70);

          // Restore the original transformations
          transformComponent.style.transform = originalTransform.scale;
          element.style.width = originalTransform.width;
          element.style.height = originalTransform.height;

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
        });
      }
    );
  };

  return (
    <div className="bg-primary">
      <UIBasicForm observer={observer}/>
      <Divider size={0}/>

      <UIHouseOwnerForm observer={houseOwnerObserver}/>
      <Divider size={0}/>

      <UIFamilyMembersForm observer={membersObserver}/>
      <Divider size={0}/>

      <Button size="small" prefixIcon={<CommonIcon.Preview/>} variant="secondary" onClick={() => setPreview(true)}>
        {t("preview")}
      </Button>

      <Sheet
        visible={preview} 
        title={t("Sớ Lễ Gia Tiên")} className="bg-primary"
        handler
        onClose={() => setPreview(false)} mask maskClosable
        height={"90vh"}
      >
        <TransformWrapper
          initialScale={0.8}
          minScale={0.1}
          maxScale={1.5}
        >
          <TransformComponent>
            <UIAncestralOfferingTemplate 
              form={{
                ...observer.getBean(),
                houseOwner: houseOwnerObserver.getBean(),
                familyMembers: membersObserver.getBean()
              }}
            />
          </TransformComponent>
        </TransformWrapper>
        {/* save button */}
        <Button 
          className="button" size="medium"
          style={{ position: "absolute", bottom: "30px", right: "15px" }}
          prefixIcon={<CommonIcon.FileDownload size={24}/>}
          onClick={exportPNG}
        >
          {t("download")}
        </Button>
      </Sheet>
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
          style={{ width: "100%" }} size="small"
          label={<Label text="Năm"/>} 
          value={observer.getBean().yearCreate} 
          onChange={(e) => observer.update("yearCreate", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }} size="small"
          label={<Label text="Tháng"/>} 
          value={observer.getBean().monthCreate} 
          onChange={(e) => observer.update("monthCreate", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }} size="small"
          label={<Label text="Ngày"/>} 
          value={observer.getBean().dayCreate} 
          onChange={(e) => observer.update("dayCreate", e.target.value)}
        />
      </div>
      <div className="flex-h justify-between">
        <Input 
          style={{ width: "100%" }} size="small"
          label={<Label text="Mùa"/>} 
          value={observer.getBean().workshipSeason} 
          onChange={(e) => observer.update("workshipSeason", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }} size="small"
          label={<Label text="Nơi Cúng"/>} 
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
  const parseDate2Solar = (date: Date) => {
    const calendarDate = DateTimeUtils.toCalendarDate(date);
    const solar = new SolarDate(calendarDate);
    const lunar = solar.toLunarDate();
    observer.update("birth", lunar.getYearName());
    observer.update("birthDate", DateTimeUtils.formatToDate(date));
  }

  return (
    <div className="flex-v bg-secondary rounded p-3">
      <Title label={t("Thí Chủ")}/>
      <div className="flex-v justify-between">
        <Input 
          size="small"
          label={<Label text="Họ Tên"/>} 
          value={observer.getBean().name}
          onChange={(e) =>
            observer.update("name", e.target.value)
          }
        />
        <DatePicker
          label={t("Ngày Sinh")}
          field="birthDate" observer={observer}
          onChange={parseDate2Solar} 
          defaultValue={
            observer.getBean().birthDate 
              ? new Date(observer.getBean().birthDate!) : undefined
          }
        />
        <div className="flex-h">
          <Input 
            style={{ width: "100%" }} size="small"
            label={<Label text="Năm"/>} 
            value={observer.getBean().birth}
            onChange={(e) =>
              observer.update("birth", e.target.value)
            }
          />
          <Input 
            style={{ width: "100%" }} size="small"
            label={<Label text="Tuổi"/>} name="age"
          />
        </div>
        <Input.TextArea
          size="medium"
          label={<Label text="Địa chỉ"/>} 
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
                label={<Label text={t("name")}/>} 
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
                style={{ width: "100%" }} size="small"
                label={<Label text={t("năm")}/>} 
                value={observer.getBean()[index]?.birth || ""}
                onChange={(e) => {
                  observer.push(index, {
                    ...observer.getBean()[index],
                    birth: e.target.value
                  })
                }}
              />
              <Input 
                style={{ width: "100%" }} size="small"
                label={<Label text={t("tuổi")}/>} 
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
