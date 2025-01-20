import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { useBeanObserver } from "hooks";
import { BeanObserver, CommonIcon, Divider, SlidingPanel, SlidingPanelOrient } from "components";

import { UIPetitionLetterTemplate } from "./UIPetitionLetterTemplate";

export type PetitionLetterPerson = {
  name?: string;
  birth?: string;
  age?: string;
  address?: string;
}
export type PetitionLetterForm = {
  // Tất cả là chữ Hán Việt
  yearCreate?: string;
  monthCreate?: string;
  dayCreate?: string;
  liveAt?: string;
  topDog: PetitionLetterPerson;
  familyMembers: PetitionLetterPerson[];
  workshipSeason?: string;
  workshipPlace?: string;
}
export function UIPetitionLetterForm() {
  const [ form, setForm ] = React.useState<PetitionLetterForm>({
    topDog: {},
    familyMembers: []
  });
  const [ showLetter, setShowLetter ] = React.useState<boolean>(false);

  const observer = useBeanObserver(form);
  const topDogObserver = useBeanObserver(form.topDog);
  const membersObserver = useBeanObserver(form.familyMembers);

  return (
    <div className="bg-primary">
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

      <Divider size={0}/>

      <div className="flex-v bg-secondary rounded p-3">
        <Title label={t("Thí Chủ")}/>
        <div className="flex-v justify-between">
          <Input 
            size="small" placeholder="Nguyễn Năng Bình"
            label={<Label label="Tên"/>} 
            value={topDogObserver.getBean().name}
            onChange={(e) =>
              topDogObserver.update("name", e.target.value)
            }
          />
          <div className="flex-h">
            <Input 
              style={{ width: "100%" }}
              size="small" placeholder="Canh Thìn"
              label={<Label label="Năm"/>} 
              value={topDogObserver.getBean().birth}
              onChange={(e) =>
                topDogObserver.update("birth", e.target.value)
              }
            />
            <Input 
              style={{ width: "100%" }}
              size="small" placeholder="25 tuổi"
              label={<Label label="Tuổi"/>} 
              value={topDogObserver.getBean().age}
              onChange={(e) =>
                topDogObserver.update("age", e.target.value)
              }
            />
          </div>
          <Input.TextArea
            size="medium" placeholder="Hải Phòng Thành, Kiến An Quận, Văn Đẩu Phường, Số 24"
            label={<Label label="Nhà"/>} 
            value={topDogObserver.getBean().address}
            onChange={(e) =>
              topDogObserver.update("address", e.target.value)
            }
          />
        </div>
      </div>

      <Divider size={0}/>

      <div className="bg-secondary rounded p-3">
        <UIPetitionLetterPerson observer={membersObserver}/>
      </div>

      <Divider size={0}/>

      <Button size="small" variant="secondary" className="flex-h" onClick={() => setShowLetter(true)}>
        {t("preview")}
      </Button>

      <SlidingPanel 
        orient={SlidingPanelOrient.LeftToRight} 
        visible={showLetter} 
        header={"Sớ Lễ Gia Tiên"}        
        close={() => setShowLetter(false)}
      >
        <UIPetitionLetterTemplate form={{
          ...observer.getBean(),
          topDog: topDogObserver.getBean(),
          familyMembers: membersObserver.getBean()
        }}/>
      </SlidingPanel>
    </div>
  )
}

function UIPetitionLetterPerson({ observer }: { 
  observer: BeanObserver<PetitionLetterPerson[]>, 
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
    <div className="flex-v">
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

const Label = ({ label }: { label: string }) => <p className="text-primary"> {t(label)} </p>
const Title = ({ label }: { label: string }) => <Text.Title className="text-primary"> {t(label)} </Text.Title>