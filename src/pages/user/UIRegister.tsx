import React from "react";
import { t } from "i18next";

import { Button, Grid, Input, Stack, Text } from "zmp-ui";

import { AccountApi } from "api";
import { FailResponse, ServerResponse } from "server";
import { Header, SlidingPanel, SlidingPanelOrient } from "components";

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
  const [ successPop, setSuccessPop ] = React.useState(false);
  const [ failPop, setFailPop ] = React.useState(false);
  const [ formData, setFormData ] = React.useState({} as RegisterForm);

  const submit = (e: any) => {
    console.log(formData);
    console.log("Now clear the form data");
    setFormData({ mobile: '', clanCode: '', fullName: '', email: '', motherName: '', motherCode: '', fatherName: '', fatherCode: '' });
    const success = (result: ServerResponse) => {
      setSuccessPop(true);
      console.log(result);
    }
    const fail = (error: FailResponse) => {
      setFailPop(true);
      console.error(error);
    }
    AccountApi.register(formData, success, fail);
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <Header title={t("register")}/>

      <UIRegisterForm formData={formData} onChange={onChange} submit={submit}/>

      <SlidingPanel
        header={t("need_access")} 
        visible={successPop} 
        orient={SlidingPanelOrient.BottomToTop}
        close={() => setSuccessPop(false)}
      >
        <Stack space="1rem" className="p-3">
          <Text.Title size="xLarge" style={{ color: "green" }} className="center">{`${t("success")}`}</Text.Title>
        </Stack>
      </SlidingPanel>

      <SlidingPanel
        header={t("need_access")} 
        visible={failPop} 
        orient={SlidingPanelOrient.BottomToTop}
        close={() => setFailPop(false)}
      >
        <Stack space="1rem" className="p-3">
          <Text.Title size="xLarge" style={{ color: "red" }} className="center">{`${t("fail")}`}</Text.Title>
        </Stack>
      </SlidingPanel>
    </div>
  );
}

function UIRegisterForm({ formData, submit, onChange }: { 
  formData: any, 
  onChange: (e: any) => void,
  submit: (e: any) => void 
}) {
  const [ error, setError ] = React.useState('');

  const submitOrError = (e: any) => {
    if (!formData.mobile || !formData.clanCode) {
      setError(t("input_required"));
      return;
    } 
    setError(''); // Clear the error if validation passes
    if (submit) submit(e);
  };

  return (
    <Stack space="1rem">
      <Grid columnSpace="0.5rem" columnCount={2}>
        <Input label={t("mobile") + "*"} value={formData.mobile} name="mobile" onChange={onChange}/>
        <Input label={t("clan_code") + "*"} value={formData.clanCode} name="clanCode" onChange={onChange}/>
      </Grid>
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input label={t("name") + "*"} value={formData.fullName} name="fullName" onChange={onChange}/>
      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

      <Input label={t("email")} value={formData.email} name="email" onChange={onChange}/>

      <Input label={t("mother_name")} value={formData.motherName} name="motherName" onChange={onChange}/>

      <Input label={t("mother_code")} value={formData.motherCode} name="motherCode" onChange={onChange}/>

      <Input label={t("father_name")} value={formData.fatherName} name="fatherName" onChange={onChange}/>

      <Input label={t("father_code")} value={formData.fatherCode} name="fatherCode" onChange={onChange}/>

      <Button variant="secondary" onClick={submitOrError}> 
        {t("register")}
      </Button>

      <UIRegisterNotice/>
    </Stack>
  );
}

function UIRegisterNotice() {
  return (
    <Stack space="1rem">
      <Text.Title className="text-capitalize">
        {t("notice")}
      </Text.Title>
      <Text size="xxSmall">
        {t("register_notice")}
      </Text>
    </Stack>
  )
}