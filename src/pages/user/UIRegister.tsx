import React from "react";
import { t } from "i18next";

import { Button, Input, Sheet, Stack, Text } from "zmp-ui";

import { Header } from "components";

type RegisterForm = {
  mobile: string;
  clanCode: string;
}

export function UIRegister() {
  const [ sheetVisible, setSheetVisible ] = React.useState(false);
  const [ formData, setFormData ] = React.useState({} as RegisterForm);

  const submit = (e: any) => {
    setSheetVisible(true);
    console.log(formData);
    console.log("Now clear the form data");
    setFormData({ mobile: '', clanCode: '' });
  };

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <Header title={t("register")}/>

      <UIRegisterForm formData={formData} onChange={onChange} submit={submit}/>

      <Sheet
        visible={sheetVisible}
        autoHeight
        mask
        handler
        swipeToClose
        onClose={() => setSheetVisible(false)}
        title={t("register")}
        className="text-capitalize"
      >
        <Stack space="1rem" className="p-3">
          <Text.Title size="xLarge" style={{ color: "#3cb371" }} className="center">{`${t("success")}`}</Text.Title>
        </Stack>
      </Sheet>
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
      <Input label={t("mobile") + "*"} value={formData.mobile} name="mobile" onChange={onChange}/>

      <Input label={t("clan_code") + "*"} value={formData.clanCode} name="clanCode" onChange={onChange}/>

      {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

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