import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { AccountApi } from "api";
import { useBeanObserver, useNotification } from "hooks";
import { BeanObserver, CommonIcon, Header, Selection } from "components";

import { FailResponse, ServerResponse } from "types/server";

export type RegisterForm = {
  mobile: string;
  gender: "male" | "female";
  clanCode: string;
  fullName: string;
  email?: string;
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
    <>
      <Header title={t("Đăng Ký Tài Khoản")}/>

      <div className="container bg-white max-h">
        <UIRegisterForm 
          observer={observer}
          submit={submit}
        />
      </div>
    </>
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
    const requireFields = [ "mobile", "clanCode", "email", "gender", "fullName" ] as const;
    const hasMissingField = requireFields.some(field => {
      const value = observer.getFieldValue(field);
      return !value?.trim(); // Checks for undefined/null/empty-string
    });
    if (hasMissingField) {
      setError(t("input_required"));
      return;
    }
    setError(''); // Clear the error if validation passes
    if (submit) submit();
  };

  return (
    <div className="flex-v text-primary">
      <Text.Title size="xLarge" className="text-capitalize">{t("personal_info")}</Text.Title>

      <div className="flex-h">
        <Input 
          label={<Label text={t("mobile") + "*"}/>} size="small"
          name={"mobile"}
          value={observer.getBean().mobile} 
          onChange={observer.watch}
        />
        <Input 
          label={<Label text={t("clan_code") + "*"}/>} size="small"
          name={"clanCode"}
          value={observer.getBean().clanCode} 
          onChange={observer.watch}
        />
      </div>
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input 
        label={<Label text={t("name") + "*"}/>} size="small"
        name={"fullName"}
        value={observer.getBean().fullName}
        onChange={observer.watch}
      />
      <Selection
        label={t("gender") + "*"}
        observer={observer} field={"gender"}
        defaultValue={{ value: "1", label: t("male") }}
        options={[
          { value: "1", label: t("male") },
          { value: "0", label: t("female") },
        ]}
      />
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input 
        label={<Label text={t("email *")}/>} size="small"
        name="email"
        value={observer.getBean().email} 
        onChange={observer.watch}
      />
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Button size="medium" onClick={submitOrError}> 
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

function Label({  text }: { text: string }) {
  return <span className="text-primary"> {t(text)} </span>
}