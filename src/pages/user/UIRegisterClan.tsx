import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { AccountApi } from "api";
import { useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Header } from "components";

import { FailResponse, ServerResponse } from "types/server";

export type RegisterClanForm = {
  clanName: string;
  country: string;
  city: string;
  district: string;
  subDistrict: string;
  address: string;
  name: string;
  mobile: string;
  email: string;
  rollInClan: string;
}

export function UIRegisterClan() {
  const observer = useBeanObserver({} as RegisterClanForm);
  const { successToast, dangerToast } = useNotification();

  const submit = () => {
    console.log(observer.getBean());
    const success = (result: ServerResponse) => {
      successToast(
        <>
          <p> {t("register")} {t("success")}</p>
          <p> {t("register_pending")} </p>
        </>
      );
    }
    const fail = (error: FailResponse) => {
      dangerToast(`${t("register")} ${t("fail")}`);
    }
    AccountApi.registerClan(observer.getBean(), success, fail);
  };

  return (
    <>
      <Header title={t("register_clan")}/>

      <div className="container bg-white max-h">
        <UIRegisterClanForm 
          observer={observer}
          submit={submit}/>
      </div>
    </>
  )
}


function UIRegisterClanForm({ observer, submit }: { 
  observer: BeanObserver<RegisterClanForm>
  submit: (e: any) => void
}) {
  const [ step, setStep ] = React.useState(1);
  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  switch (step) {
    case 1:
      return (
        <ClanForm 
          observer={observer}
          nextStep={nextStep} 
        />
      )
    case 2:
      return (
        <AddressForm 
          observer={observer}
          nextStep={nextStep} 
          previousStep={prevStep} 
        />
      );
    case 3:
      return (
        <PersionalForm 
          observer={observer}
          nextStep={nextStep} 
          previousStep={prevStep} 
          handleSubmit={submit}
        />
      )
    default:
      return <></>;
  }
}

interface StepProps {
  observer: BeanObserver<RegisterClanForm>;
  nextStep: () => void, 
  previousStep?: () => void; 
  handleSubmit?: (e: any) => void;
}
function ClanForm(props: StepProps) {
  const { observer, nextStep } = props; 
  const [ error, setError ] = React.useState('');

  const handleNextStep = () => {
    if (!observer.getFieldValue("clanName")) {
      setError(t("clan_name_required"));
      return;
    }
    setError(''); // Clear the error if validation passes
    nextStep();
  };

  return (
    <div className="flex-v text-primary">
      <Text.Title size="xLarge" className="text-capitalize center">{t("clan_info")}</Text.Title>

      <Input 
        label={<Label text={t("Tên Dòng Họ *")}/>} size="small" name="clanName" 
        value={observer.getBean().clanName} 
        onChange={observer.watch}
      />
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Button size="medium" onClick={handleNextStep}> 
        {t("next")}
      </Button>
    </div>
  )
}

function AddressForm(props: StepProps) {
  const { observer, nextStep, previousStep } = props; 
  const [ error, setError ] = React.useState('');

  const handleNextStep = () => {
    if (!observer.getBean().address 
      // !observer.getFieldValue("country") 
      // || !observer.getFieldValue("city")
      // || !observer.getFieldValue("district")
    ) {
      setError(t("input_required"));
      return;
    }
    setError(''); // Clear the error if validation passes
    nextStep();
  };

  return (
    <div className="flex-v text-primary">
      <Text.Title size="xLarge" className="text-capitalize center">{t("address")}</Text.Title>

      {/* <Input 
        label={t("country") + "*"} name="country" size="small"
        value={observer.getBean().country} 
        onChange={observer.watch}
      />
      <Input 
        label={t("city") + "*"} name="city" size="small"
        value={observer.getBean().city} onChange={observer.watch}
      />
      <Input 
        label={t("district") + "*"} name="district" size="small"
        value={observer.getBean().district} onChange={observer.watch}
      />
      <Input 
        label={t("sub_district") + "*"} name="subDistrict" size="small"
        value={observer.getBean().subDistrict} onChange={observer.watch}
      /> */}

      <Input.TextArea 
        // label={<Label text={t("address")}/>} 
        name="address" 
        value={observer.getBean().address} 
        onChange={(e) => {
          observer.update("address", e.target.value);
        }}
      />

      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <div className="flex-h justify-between">
        <Button size="small" onClick={previousStep}> 
          {t("previous")}
        </Button>
        <Button size="small" onClick={handleNextStep}> 
          {t("next")}
        </Button>
      </div>

      <UIRegisterNotice/>
    </div>
  )
}

function PersionalForm(props: StepProps) {
  const { observer, handleSubmit, previousStep } = props; 
  const [ error, setError ] = React.useState('');

  const submitOrError = (e: any) => {
    if (!observer.getBean().name || !observer.getBean().mobile) {
      setError(t("input_required"));
      return;
    } 
    setError(''); // Clear the error if validation passes
    if (handleSubmit) handleSubmit(e);
  };

  return (
    <div className="flex-v text-primary">
      <Text.Title size="xLarge" className="text-capitalize center">{t("clan_manager")}</Text.Title>

      <div className="flex-v">
        <Input 
          label={<Label text={t("Họ và Tên *")}/>} name="name" size="small"
          value={observer.getBean().name} onChange={observer.watch}
        />
        <Input 
          label={<Label text={t("Số Điện Thoại *")}/>} name="mobile" size="small"
          value={observer.getBean().mobile} onChange={observer.watch}
        />
        <Input 
          label={<Label text={t("email")}/>} name="email" size="small"
          value={observer.getBean().email} onChange={observer.watch}
        />

        {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

        <div className="flex-h justify-between">
          <Button size="small" onClick={previousStep}> 
            {t("previous")}
          </Button>
          <Button size="small" onClick={submitOrError}> 
            {t("submit")}
          </Button>
        </div>

        <UIRegisterNotice/>
      </div>
    </div>
  )
}

function UIRegisterNotice() {
  return (
    <div className="flex-v">
      <div className="flex-h">
        <CommonIcon.LightBulb size={22}/>
        <Text.Title className="text-capitalize">
          {t("notice")}
        </Text.Title>
      </div>
      <p> {t("register_clan_notice")} </p>
    </div>
  )
}

function Label({  text }: { text: string }) {
  return <span className="text-primary"> {t(text)} </span>
}