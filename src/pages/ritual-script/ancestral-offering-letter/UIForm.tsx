import React from "react";
import { t } from "i18next";
import html2canvas from "html2canvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button, Input, Sheet, DatePicker, Text } from "zmp-ui";
import { SolarDate } from "@nghiavuive/lunar_date_vi";

import { DateTimeUtils, ZmpSDK } from "utils";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Label } from "components";

import { UIAncestralOfferingTemplate } from "./UITemplate";

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

function Title({ text, className }: { text: string, className?: string }) {
  return (
    <Text.Title className={`text-center text-primary text-capitalize ${className}`.trim()}>
      {text}
    </Text.Title>
  )
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
          onFail(t("download_fail"));
        });
      }
    );
  };

  return (
    <div className="flex-v">
      <UIBasicForm observer={observer}/>

      <UIHouseOwnerForm observer={houseOwnerObserver}/>

      <UIFamilyMembersForm observer={membersObserver}/>

      <div style={{ position: "absolute", bottom: 20 }}>
        <Button size="small" prefixIcon={<CommonIcon.Preview size={18}/>} onClick={() => setPreview(true)}>
          {t("preview")}
        </Button>
      </div>

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
    <div className="flex-v border-primary p-3 rounded">
      <Title text={t("thiên thời")} className="text-center"/>
      <div className="flex-h justify-between">
        <Input 
          style={{ width: "100%" }} 
          label={<Label text={t("năm")}/>} 
          value={observer.getBean().yearCreate} 
          onChange={(e) => observer.update("yearCreate", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }} 
          label={<Label text={t("tháng")}/>} 
          value={observer.getBean().monthCreate} 
          onChange={(e) => observer.update("monthCreate", e.target.value)}
        />
      </div>
      <div className="flex-h justify-between">
        <Input 
          style={{ width: "100%" }} 
          label={<Label text={t("ngày")}/>} 
          value={observer.getBean().dayCreate} 
          onChange={(e) => observer.update("dayCreate", e.target.value)}
        />
        <Input 
          style={{ width: "100%" }} 
          label={<Label text={t("mùa")}/>} 
          value={observer.getBean().workshipSeason} 
          onChange={(e) => observer.update("workshipSeason", e.target.value)}
        />
      </div>
      <Input.TextArea 
        label={<Label text={t("nơi cúng")}/>} size="medium"
        value={observer.getBean().workshipPlace} 
        onChange={(e) => observer.update("workshipPlace", e.target.value)}
      />
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
    <div className="flex-v border-primary rounded p-3">
      <Title text={t("thí chủ")} className="text-center"/>
      <div className="flex-v justify-between">
        <Input 
          
          label={<Label text="Họ Tên"/>} 
          value={observer.getBean().name}
          onChange={(e) =>
            observer.update("name", e.target.value)
          }
        />
        <DatePicker
          mask maskClosable 
          label={t("Ngày Sinh")} title={t("Ngày Sinh")}
          onChange={parseDate2Solar}
          defaultValue={
            observer.getBean().birthDate 
              ? new Date(observer.getBean().birthDate!) : undefined
          }
        />
        <div className="flex-h">
          <Input 
            style={{ width: "100%" }} 
            label={<Label text={t("năm")}/>} 
            value={observer.getBean().birth}
            onChange={(e) =>
              observer.update("birth", e.target.value)
            }
          />
          <Input 
            style={{ width: "100%" }} 
            label={<Label text={t("tuổi")}/>} name="age"
          />
        </div>
        <Input.TextArea
          size="medium"
          label={<Label text={t("địa chỉ")}/>} 
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
    <div className="border-primary rounded p-3">
      <Title text={t("thành viên")} className="text-center py-2"/>
      <div className="text-primary button flex-h justify-end">
        <Button size="small" onClick={addForm} prefixIcon={<CommonIcon.Plus/>}>
          {t("add")} 
        </Button>
      </div>

      {people.map((person, index) => (
        <div key={person} className="px-2 mt-2">
          <div className="flex-v">
            <div className="flex-h justify-start text-primary">
              <Button size="small" onClick={() => removeForm(person)} prefixIcon={<CommonIcon.Minus/>}>
                {t("xoá")} 
              </Button>
            </div>
            <div className="flex-h">
              <Input 
                style={{ width: "100%" }} 
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
                style={{ width: "100%" }} 
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
                style={{ width: "100%" }} 
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
