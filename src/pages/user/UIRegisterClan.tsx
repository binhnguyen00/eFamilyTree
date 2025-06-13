import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { AccountApi } from "api";
import { ServerResponse } from "types";
import { BeanObserver, CommonIcon, Header, Label } from "components";
import { useBeanObserver, useNotification, useRequestPhoneContext, useRouteNavigate } from "hooks";

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
  const { loadingToast } = useNotification();
  const { needPhone, requestPhone } = useRequestPhoneContext();
  const { goHome } = useRouteNavigate();

  const submit = () => {
    if (needPhone) { requestPhone(); return; }
    else loadingToast({
      content: <p> {t("Đang gửi yêu cầu...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        AccountApi.registerClan({
          registerForm: observer.getBean(),
          success: (result: ServerResponse) => {
            successToastCB(
              <div className="flex-v">
                <p> {t("register")} {t("success")}</p>
                <p> {t("register_pending")} </p>
              </div>
            );
            goHome();
          }, 
          fail: () => {
            dangerToastCB(`${t("register")} ${t("fail")}`);
          }
        })
      }
    })
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
      <Text.Title size="xLarge" className="text-capitalize center py-2">{t("clan_info")}</Text.Title>

      <Input 
        label={<Label text={t("Tên Dòng Họ *")}/>} name="clanName" 
        value={observer.getBean().clanName} 
        onChange={observer.watch}
      />
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <div className="flex-h justify-end">
        <Button size="medium" onClick={handleNextStep}> 
          <div className="flex-h center">  
            <p> {t("next")} </p> 
            <CommonIcon.ArrowRight/>
          </div>
        </Button>
      </div>
    </div>
  )
}

function AddressForm(props: StepProps) {
  const { observer, nextStep, previousStep } = props; 
  const [ error, setError ] = React.useState('');

  const handleNextStep = () => {
    if (!observer.getBean().address) {
      setError(t("input_required"));
      return;
    }
    setError(''); // Clear the error if validation passes
    nextStep();
  };

  return (
    <div className="flex-v text-primary">
      <Text.Title size="xLarge" className="text-capitalize center py-2">{t("address")}</Text.Title>

      <Input.TextArea 
        name="address" 
        value={observer.getBean().address} 
        onChange={(e) => {
          observer.update("address", e.target.value);
        }}
      />

      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <div className="flex-h justify-between">
        <Button size="medium" onClick={previousStep}> 
          <div className="flex-h center">  
            <CommonIcon.ArrowLeft/>
            <p> {t("previous")} </p> 
          </div>
        </Button>
        <Button size="medium" onClick={handleNextStep}> 
          <div className="flex-h center">  
            <p> {t("next")} </p> 
            <CommonIcon.ArrowRight/>
          </div>
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
      <Text.Title size="xLarge" className="text-capitalize center py-2">{t("clan_manager")}</Text.Title>

      <div className="flex-v">
        <Input 
          label={<Label text={t("Họ và Tên *")}/>} name="name"
          value={observer.getBean().name} onChange={observer.watch}
        />
        <Input 
          label={<Label text={t("Số Điện Thoại *")}/>} name="mobile" type="number"
          value={observer.getBean().mobile} onChange={observer.watch}
        />
        <Input 
          label={<Label text={t("email")}/>} name="email"
          value={observer.getBean().email} onChange={observer.watch}
        />

        {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

        <div className="flex-h justify-between">
          <Button size="medium" onClick={previousStep}> 
            <div className="flex-h center">  
              <CommonIcon.ArrowLeft/>
              <p> {t("previous")} </p> 
            </div>
          </Button>
          <Button size="medium" onClick={submitOrError}> 
            <div className="flex-h center">  
              <p> {t("submit")} </p> 
              <CommonIcon.SendMail size={"1.3rem"}/>
            </div>
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