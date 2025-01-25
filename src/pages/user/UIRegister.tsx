import React from "react";
import { t } from "i18next";
import { Button, Grid, Input, Text } from "zmp-ui";
import { AccountApi } from "api";
import { BeanObserver, CommonIcon, Header, Selection } from "components";

import { FailResponse, ServerResponse } from "types/server";
import { useBeanObserver, useNotification } from "hooks";

export type RegisterForm = {
  mobile: string;
  gender: "male" | "female";
  clanCode: string;
  fullName: string;
  email?: string;
  motherName?: string;
  motherCode?: string;
  fatherName?: string;
  fatherCode?: string;
  spouseName?: string;
  spouseCode?: string;
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
    console.log(observer.getBean());
    
    const requireFields = [ "mobile", "clanCode", "fatherCode" ] as const;
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
    <div className="flex-v">
      <div className="flex-h">
        <Input 
          label={t("mobile") + "*"} size="small"
          name={"mobile"}
          value={observer.getBean().mobile} 
          onChange={observer.watch}
        />
        <Input 
          label={t("clan_code") + "*"} size="small"
          name={"clanCode"}
          value={observer.getBean().clanCode} 
          onChange={observer.watch}
        />
      </div>
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <div className="flex-h">
        <Input 
          label={t("name") + "*"} size="small"
          name={"fullName"}
          value={observer.getBean().fullName}
          onChange={observer.watch}
        />
        <Selection
          label={t("gender") + "*"}
          observer={observer} field={"gender"}
          defaultValue={{ value: "male", label: t("male") }}
          options={[
            { value: "male", label: t("male") },
            { value: "female", label: t("female") },
          ]}
        />
      </div>
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input 
        label={t("email")} size="small"
        name="email"
        value={observer.getBean().email} 
        onChange={observer.watch}
      />

      <div className="flex-h">
        <Input 
          label={t("mother_name")} size="small"
          name="motherName"
          value={observer.getBean().motherName} 
          onChange={observer.watch}
        />
        <Input 
          label={t("mother_code")} size="small"
          name="motherCode"
          value={observer.getBean().motherCode}
          onChange={observer.watch}
        />
      </div>

      <div className="flex-h">
        <Input 
          label={t("father_name")} size="small"
          name="fatherName"
          value={observer.getBean().fatherName} 
          onChange={observer.watch}
        />
        <Input 
          label={t("father_code")} size="small"
          name="fatherCode"
          value={observer.getBean().fatherCode}
          onChange={observer.watch}
        />
      </div>
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <div className="flex-h">
        <Input 
          label={`${t("spouse_name")}`} size="small"
          name="spouseName"
          value={observer.getBean().spouseName} 
          onChange={observer.watch}
        />
        <Input 
          label={`${t("spouse_code")}`} size="small"
          name="spouseCode"
          value={observer.getBean().spouseCode}
          onChange={observer.watch}
        />
      </div>

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