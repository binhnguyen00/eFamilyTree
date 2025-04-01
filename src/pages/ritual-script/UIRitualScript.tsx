import React from "react";
import { t } from "i18next";
import { Text } from "zmp-ui";

import { Header, ScrollableDiv, Selection, SelectionOption } from "components";

import { UIBinhAnForm } from "./phuc-tho/UIForm";
import { UIVuLanForm } from "./vu-lan-script/UIForm";
import { UIGiaTienForm } from "./gia-tien/UIForm";

export function UIRitualScript() {
  const [ number, setNumber ] = React.useState<number>(1);

  const options: any[] = [
    { value: 1, label: "Phúc Thọ" },
    { value: 2, label: "Vu Lan" },
    { value: 3, label: "Gia Tiên" },
  ]

  const renderContainer = () => {
    switch (number) { 
      case 1: 
        return <UIBinhAnForm />;
      case 2: 
        return <UIVuLanForm/>;
      case 3: 
        return <UIGiaTienForm/>;
      default: 
        return <UIBinhAnForm />;
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