import React from "react";
import { t } from "i18next";
import { Button, Input, Text } from "zmp-ui";

import { AccountApi } from "api";
import { ServerResponse } from "types";
import { BeanObserver, CommonIcon, Header, Label, Selection } from "components";
import { useBeanObserver, useNotification, useRequestPhoneContext, useRouteNavigate } from "hooks";


export type RegisterForm = {
  mobile: string;
  gender: "male" | "female";
  clanCode: string;
  fatherCode: string;
  fullName: string;
  email?: string;
}

export function UIRegister() {
  const observer = useBeanObserver({} as RegisterForm);
  const { loadingToast } = useNotification();
  const { needPhone, requestPhone } = useRequestPhoneContext();
  const { goHome } = useRouteNavigate();

  const submit = () => {
    if (needPhone) { requestPhone(); return; }
    else loadingToast({
      content: <p> {t("Đang gửi yêu cầu...")} </p>,
      operation: (successToastCB, dangerToastCB) => {
        AccountApi.register({
          registerForm: observer.getBean(),
          success: (result: ServerResponse) => {
            successToastCB(
              <>
                <p> {t("register")} {t("success")} </p>
                <p> {t("register_pending")} </p>
              </>
            );
            goHome();
          },
          fail: () => {
            dangerToastCB(`${t("register")} ${t("fail")}`);
          }
        });
      }
    })
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
    const requireFields = [ "mobile", "clanCode", "fatherCode", "email", "gender", "fullName" ] as const;
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
    <div className="flex-v scroll-v text-primary">
      <Text.Title size="xLarge" className="text-capitalize text-center py-2">{t("personal_info")}</Text.Title>

      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input 
        label={<Label text={t("mobile") + "*"}/>}
        name={"mobile"} type="number"
        value={observer.getBean().mobile} 
        onChange={observer.watch}
      />
      <Input 
        label={<Label text={t("clan_code") + "*"}/>}
        name={"clanCode"}
        value={observer.getBean().clanCode} 
        onChange={observer.watch}
      />
      <Input 
        label={<Label text={t("Mã Bố") + "*"}/>}
        name={"fatherCode"}
        value={observer.getBean().fatherCode} 
        onChange={observer.watch}
      />

      <Input 
        label={<Label text={t("name") + "*"}/>}
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

      <Input 
        label={<Label text={t("email *")}/>}
        name="email"
        value={observer.getBean().email} 
        onChange={observer.watch}
      />

      <div className="center">
        <Button size="medium" prefixIcon={<CommonIcon.SendMail size={"1.4rem"}/>} onClick={submitOrError}> 
          {t("register")}
        </Button>
      </div>
      
      <UIRegisterNotice/>

      <br />
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