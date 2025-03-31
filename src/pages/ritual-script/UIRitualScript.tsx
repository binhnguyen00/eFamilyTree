import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";

import { Header, ScrollableDiv, Selection, SelectionOption } from "components";

import { UIGiaTienForm } from "./gia-tien-script/UIForm";
import { UIVuLanForm } from "./vu-lan-script/UIForm";

export function UIRitualScript() {
  const [ number, setNumber ] = React.useState<number>(1);

  const options: any[] = [
    { value: 1, label: "Lễ Gia Tiên" },
    { value: 2, label: "Vu Lan" },
  ]

  const renderContainer = () => {
    switch (number) { 
      case 1: 
        return <UIGiaTienForm />;
      case 2: 
        return <UIVuLanForm/>;
      default: 
        return <UIGiaTienForm />;
    }
  }

  return (
    <>
      <Header title={t("ritual_script")}/>

      <div className="container bg-white flex-v">
        <div>
          <Text.Title className="my-2 text-primary text-capitalize">
            {t("chọn loại sớ")}
          </Text.Title>
          <Selection 
            options={options}
            defaultValue={options[0]}
            onChange={(selected: SelectionOption, action) => setNumber(selected.value)} 
            isClearable={false} isSearchable={false}
            label={""} field={""} observer={null as any}
          />
        </div>

        <ScrollableDiv direction="vertical" className="flex-v">
          {renderContainer()}
        </ScrollableDiv>
      </div>
    </>
  )
}