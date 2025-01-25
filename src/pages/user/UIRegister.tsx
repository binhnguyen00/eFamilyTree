import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Stack, Text } from "zmp-ui";
import { AccountApi } from "api";
import { BeanObserver, CommonIcon, Header } from "components";

import { FailResponse, ServerResponse } from "types/server";
import { useBeanObserver, useNotification } from "hooks";

export type RegisterForm = {
  mobile: string;
  clanCode: string;
  fullName: string;
  email?: string;
  motherName?: string;
  motherCode?: string;
  fatherName?: string;
  fatherCode?: string;
}

export function UIRegister() {
  const { successToast, dangerToast } = useNotification();
  const observer = useBeanObserver({} as RegisterForm);

  const submit = () => {
    console.log(observer.getBean());
    const success = (result: ServerResponse) => {
      successToast(
        <>
          <p> {t("register")} {t("success")} </p>
          <p> {t("register_pending")} </p>
        </>
      );
    }
    const fail = (error: FailResponse) => {
      dangerToast(`${t("register")} ${t("fail")}`);
    }
    AccountApi.register(observer.getBean(), success, fail);
  };

  return (
    <div className="container">
      <Header title={`${t("register")} ${t("member")}`}/>

      <UIRegisterForm 
        observer={observer}
        submit={submit}
      />
    </div>
  );
}

// ===============================
// REGISTER FORM
// ===============================
function UIRegisterForm({ observer, submit }: { 
  observer: BeanObserver<RegisterForm>;
  submit: () => void 
}) {
  const [ error, setError ] = React.useState('');

  const submitOrError = (e: any) => {
    if (!observer.getBean().mobile || !observer.getBean().clanCode) {
      setError(t("input_required"));
      return;
    } 
    setError(''); // Clear the error if validation passes
    if (submit) submit();
  };

  return (
    <div className="flex-v">
      <Grid columnSpace="0.5rem" columnCount={2}>
        <Input 
          label={t("mobile") + "*"} size="small"
          value={observer.getBean().mobile} 
          onChange={(e) => observer.update("mobile", e.target.value)}
        />
        <Input 
          label={t("clan_code") + "*"} size="small"
          value={observer.getBean().clanCode} 
          onChange={(e) => observer.update("clanCode", e.target.value)}
        />
      </Grid>
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input 
        label={t("name") + "*"} size="small"
        value={observer.getBean().fullName}
        onChange={(e) => observer.update("fullName", e.target.value)}
      />
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input 
        label={t("email")} size="small"
        value={observer.getBean().email} 
        onChange={(e) => observer.update("email", e.target.value)}
      />

      <Input 
        label={t("mother_name")} size="small"
        value={observer.getBean().motherName} 
        onChange={(e) => observer.update("motherName", e.target.value)}
      />
      <Input 
        label={t("mother_code")} size="small"
        value={observer.getBean().motherCode}
        onChange={(e) => observer.update("motherCode", e.target.value)}
      />

      <Input 
        label={t("father_name")} size="small"
        value={observer.getBean().fatherName} 
        onChange={(e) => observer.update("fatherName", e.target.value)}
      />
      <Input 
        label={t("father_code")} size="small"
        value={observer.getBean().fatherCode}
        onChange={(e) => observer.update("fatherCode", e.target.value)}
      />

      <Button variant="secondary" size="medium" onClick={submitOrError}> 
        {t("register")}
      </Button>
      
      <UIRegisterNotice/>
    </div>
  );
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
      <p> {t("register_notice")} </p>
    </div>
  )
}