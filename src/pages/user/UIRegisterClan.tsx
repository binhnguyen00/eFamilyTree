import React from "react";
import { t } from "i18next";

import { Box, Button, Input, Stack, Text, Sheet } from "zmp-ui";

import { Header } from "components";

type RegisterForm = {
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

export default function UIRegisterClan() {
  const [ sheetVisible, setSheetVisible ] = React.useState(false);
  const [ formData, setFormData ] = React.useState({} as RegisterForm);

  const submit = (e: any) => {
    setSheetVisible(true);
    console.log(formData);
    console.log("Now clear the form data");
    setFormData({ clanName: '', country: '', city: '', district: '', subDistrict: '', address: '', name: '', mobile: '', email: '', rollInClan: '' });
  };

  return (
    <div className="container">
      <Header title={t("register_clan")}/>

      <UIRegisterClanForm formData={formData} setFormData={setFormData} submit={submit}/>

      <Sheet
        visible={sheetVisible}
        autoHeight
        mask
        handler
        swipeToClose
        onClose={() => setSheetVisible(false)}
        title={t("register_clan")}
        className="text-capitalize"
      >
        <Stack space="1rem" className="p-3">
          <Text size="large" style={{ color: "#3cb371" }} className="center">{`${t("submit")} ${t("success")}`}</Text>
          <p style={{ textTransform: "none" }}>{t("register_clan_success")}</p>
        </Stack>
      </Sheet>
    </div>
  )
}


function UIRegisterClanForm({ formData, setFormData, submit }: { 
  formData: RegisterForm, 
  setFormData: React.Dispatch<React.SetStateAction<RegisterForm>> 
  submit: (e: any) => void
}) {

  const [ step, setStep ] = React.useState(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    submit(e);
  };

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  switch (step) {
    case 1:
      return <ClanForm nextStep={nextStep} formData={formData} handleChange={handleChange} />;
    case 2:
      return <AddressForm nextStep={nextStep} previousStep={prevStep} formData={formData} handleChange={handleChange} />;
    case 3:
      return (
        <PersionalForm 
          nextStep={nextStep} 
          previousStep={prevStep} 
          formData={formData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit}
        />
      )
    default:
      return <></>;
  }
}

interface StepProps {
  nextStep: () => void, 
  previousStep?: () => void; 
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; 
  handleSubmit?: (e: any) => void;
  formData: RegisterForm;
}

function ClanForm(props: StepProps) {
  const { formData, handleChange, nextStep } = props; 
  const [ error, setError ] = React.useState('');

  const handleNextStep = () => {
    if (!formData.clanName) {
      setError(t("clan_name_required"));
      return;
    }
    setError(''); // Clear the error if validation passes
    nextStep();
  };

  return (
    <Box flex flexDirection="column" justifyContent="center">
      <Text.Title size="xLarge" className="text-capitalize center">{t("clan_info")}</Text.Title>

      <Stack space="1rem">
        <Input label={t("clan") + "*"} name="clanName" value={formData.clanName} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>
        {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

        <Button variant="secondary" onClick={handleNextStep}> 
          {t("next")}
        </Button>
      </Stack>
    </Box>
  )
}

function AddressForm(props: StepProps) {
  const { formData, handleChange, nextStep, previousStep } = props; 
  const [ error, setError ] = React.useState('');

  const handleNextStep = () => {
    if (!formData.country || !formData.city || !formData.district) {
      setError(t("input_required"));
      return;
    } 
    setError(''); // Clear the error if validation passes
    nextStep();
  };

  return (
    <Box flex flexDirection="column" justifyContent="center">
      <Text.Title size="xLarge" className="text-capitalize center">{t("address")}</Text.Title>

      <Stack space="1rem">
        <Input label={t("country") + "*"} name="country" value={formData.country} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>

        <Input label={t("city") + "*"} name="city" value={formData.city} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>

        <Input label={t("district") + "*"} name="district" value={formData.district} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>

        <Input label={t("sub_district") + "*"} name="subDistrict" value={formData.subDistrict} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>

        <Input.TextArea label={t("address")} name="address" value={formData.address} onChange={handleChange}/>

        {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

        <Box flex flexDirection="row" justifyContent="space-between">
          <Button variant="secondary" onClick={previousStep}> 
            {t("previous")}
          </Button>
          <Button variant="secondary" onClick={handleNextStep}> 
            {t("next")}
          </Button>
        </Box>

        <UIRegisterNotice/>
      </Stack>
    </Box>
  )
}

function PersionalForm(props: StepProps) {
  const { formData, handleChange, handleSubmit, previousStep } = props; 
  const [ error, setError ] = React.useState('');

  const submitOrError = (e: any) => {
    if (!formData.country || !formData.city || !formData.district) {
      setError(t("input_required"));
      return;
    } 
    setError(''); // Clear the error if validation passes
    if (handleSubmit) handleSubmit(e);
  };

  return (
    <Box flex flexDirection="column" justifyContent="center">
      <Text.Title size="xLarge" className="text-capitalize center">{t("personal_info")}</Text.Title>

      <Stack space="1rem">
        <Input label={t("name") + "*"} name="name" value={formData.name} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>
        <Input label={t("mobile") + "*"} name="mobile" value={formData.mobile} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>
        <Input label={t("email") + "*"}  name="email" value={formData.email} onChange={(e) => {
          handleChange(e);
          setError('');
        }}/>
        <Input label={t("roll_in_clan")} name="rollInClan" value={formData.rollInClan} onChange={handleChange}/>

        {error && (<Text size="xSmall" className="text-capitalize"> {error} </Text>)}

        <Box flex flexDirection="row" justifyContent="space-between">
          <Button variant="secondary" onClick={previousStep}> 
            {t("previous")}
          </Button>
          <Button variant="secondary" onClick={submitOrError}> 
            {t("submit")}
          </Button>
        </Box>

        <UIRegisterNotice/>
      </Stack>
    </Box>
  )
}

function UIRegisterNotice() {
  return (
    <Stack space="1rem">
      <Text.Title className="text-capitalize">
        {t("notice")}
      </Text.Title>
      <Text size="xxSmall">
        {t("register_clan_notice")}
      </Text>
    </Stack>
  )
}