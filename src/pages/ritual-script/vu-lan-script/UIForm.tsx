import React from "react";
import html2canvas from "html2canvas";
import { t } from "i18next";
import { SolarDate } from "@nghiavuive/lunar_date_vi";
import { Button, Input, Sheet } from "zmp-ui";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { DateTimeUtils, ZmpSDK } from "utils";
import { BeanObserver, CommonIcon, Label, Title } from "components";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { UIVuLanTemplate } from "./UITemplate";

/** Sớ Vu Lan Báo Hiếu */

export interface VuLanForm {
  day:          string,
  month:        string,
  year:         string,
  whoAmI:       string,
  whereILive:   string,
  whatIWant:    string,
  whereISubmit: string,
}

export function UIVuLanForm() {
  const calendarDate            = DateTimeUtils.toCalendarDate(new Date());
  const solar                   = new SolarDate(calendarDate);
  const lunar                   = solar.toLunarDate();
  const [ preview, setPreview ] = React.useState<boolean>(false);

  const { zaloUserInfo } = useAppContext();
  const { loadingToast } = useNotification();

  const observer = useBeanObserver({
    day:          lunar.getDayName(),
    month:        lunar.getMonthName(),
    year:         lunar.getYearName(),
    whoAmI:       zaloUserInfo.name,
    whereILive:   "",
    whatIWant:    "",
    whereISubmit: ""
  } as VuLanForm)
  
  const renderCurrentDate = () => {
    return (
      <div className="flex-h">
        <Input style={{ width: "100%" }} label={<Label text={t("ngày")}/>} value={observer.getBean().day}/>
        <Input style={{ width: "100%" }} label={<Label text={t("tháng")}/>} value={observer.getBean().month}/>
        <Input style={{ width: "100%" }} label={<Label text={t("năm")}/>} value={observer.getBean().year}/>
      </div>
    )
  }

  const exportPNG = () => {
    loadingToast(
      t("preparing_data"),
      (successToast, dangerToast, dismissToast) => {
        const element = document.getElementById('vu-lan-script');
        if (!element) { 
          dangerToast(t("download_fail")); 
          return;
        }

        const transformComponent = document.querySelector('.react-transform-component') as HTMLElement;
        if (!transformComponent) { 
          dangerToast(t("download_fail")); 
          return;
        }

        const originalTransform = {
          scale: transformComponent.style.transform,
          width: element.style.width,
          height: element.style.height,
        };

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
            () => successToast(
              <div>
                <p> {t("download_success")} </p>
                <p> {t("check_your_gallery")} </p>
              </div>
            ), 
            () => dangerToast(t("download_fail"))
          );
        }).catch((err) => {
          dangerToast(t("download_fail"));
        });
      }
    )
  }

  return (
    <div className="flex-v">
      <section className="rounded border-primary p-3 flex-v">
        <Title text={t("thiên thời")} className="text-center"/>
        {renderCurrentDate()}
      </section>

      <section className="rounded border-primary p-3 flex-v">
        <Title text={`${t("nay chúng con là")}:`}/>
        <Input.TextArea 
          value={observer.getBean().whoAmI} size="large"
          onChange={(e) => observer.update("whoAmI", e.target.value)}
        />
      </section>

      <section className="rounded border-primary p-3 flex-v">
        <Title text={`${t("trú tại")}:`}/>
        <Input.TextArea 
          value={observer.getBean().whereILive} size="medium"
          onChange={(e) => observer.update("whereILive", e.target.value)}
        />
      </section>

      <section className="rounded border-primary p-3 flex-v">
        <Title text={`${t("Nhân tiết Vu Lan cầu siêu tiến cho Chân linh Gia tiên nội ngoại")}:`} className="text-center"/>
        <Input.TextArea 
          value={observer.getBean().whatIWant} size="large"
          onChange={(e) => observer.update("whatIWant", e.target.value)}
        />
      </section>

      <section className="rounded border-primary p-3 flex-v">
        <Title text={`${t("Đệ tử chúng con kính dâng văn sớ tại")}:`} className="text-center"/>
        <Input.TextArea 
          value={observer.getBean().whereISubmit} size="small"
          onChange={(e) => observer.update("whereISubmit", e.target.value)}
        />
      </section>

      <section style={{ position: "absolute", bottom: 20 }}>
        <Button size="small" prefixIcon={<CommonIcon.Preview size={18}/>} onClick={() => setPreview(true)}>
          {t("preview")}
        </Button>
      </section>

      <UIPreview visible={preview} setVisible={setPreview} exportPNG={exportPNG} observer={observer}/>

      <br/><br/>
    </div>
  )
}

interface UIPreviewProps {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  exportPNG: () => void;
  observer: BeanObserver<VuLanForm>,
}
function UIPreview(props: UIPreviewProps) {
  const { visible, observer, setVisible, exportPNG} = props;

  return (
    <Sheet
      title={t("Sớ Vu Lan")} height={"90vh"}
      visible={visible} onClose={() => setVisible(false)}
    >
      <TransformWrapper
        initialScale={0.8}
        minScale={0.1}
        maxScale={1.5}
      >
        <TransformComponent>
          <UIVuLanTemplate form={observer.getBean()}/>
        </TransformComponent>
      </TransformWrapper>
      {/* save button */}
      <Button 
        className="button" size="small" style={{ position: "absolute", bottom: "30px", right: "15px" }}
        prefixIcon={<CommonIcon.FileDownload/>} onClick={exportPNG}
      >
        {t("download")}
      </Button>
    </Sheet>
  )
}