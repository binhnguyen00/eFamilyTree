import React from "react";
import { t } from "i18next";
import { Button, Input } from "zmp-ui";

import { ZmpSDK } from "utils";
import { 
  CommonIcon, Coordinate, 
  RequestLocation, 
  SlidingPanel, SlidingPanelOrient } from "components";
import { MemorialMapApi } from "api";
import { useAppContext, useBeanObserver, useNotification } from "hooks";

import { ServerResponse } from "types/server";

interface CreateButtonProps {
  onAdd?: (coor: Coordinate) => void;
  locationPermission: boolean;
}
export function CreateButton({ onAdd, locationPermission }: CreateButtonProps) {
  const { logedIn } = useAppContext();

  const [ requestLoc, setRequestLoc ] = React.useState(false); 
  const [ addMarkerVisible, setAddMarkerVisible ] = React.useState(false);

  const onAddMarker = () => {
    if (!locationPermission || !logedIn) {
      setRequestLoc(true);
    } else {
      if (onAdd) {
        setAddMarkerVisible(true);
      }
    }
  }

  const save = (record: any) => {
    console.log(record);
    
    const saveSuccess = (result: ServerResponse) => {
      if (result.status !== "error") {
        onAdd?.({
          lat: result.data.latitude,
          lng: result.data.longitude
        });
      }
    }
    MemorialMapApi.save(record, saveSuccess);
  }

  return (
    <>
      <Button
        variant="secondary" size="small" 
        onClick={onAddMarker}
        prefixIcon={<CommonIcon.Plus/>}
      >
        {t("Thêm Nhanh")}
      </Button>

      <SlidingPanel 
        className="bg-white"
        orient={SlidingPanelOrient.LeftToRight} 
        visible={addMarkerVisible} 
        header={"Thêm toạ độ mới"}      
        close={() => setAddMarkerVisible(false)}
      >
        <Form onSave={(record: any) => save(record)}/>
      </SlidingPanel>

      <RequestLocation
        visible={requestLoc}
        close={() => setRequestLoc(false)}
      />
    </>
  )
}

function InputLabel({ text, required }: { text: string, required?: boolean }) {
  return <span className="text-primary"> {`${t(text)} ${required ? "*" : ""}`} </span>
}

function Form({ onSave }: { onSave: (record: any) => void; }) {
  const { warningToast } = useNotification();
  const observer = useBeanObserver({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    images: [] // TODO: Implement images
  })

  const save = () => {
    const successLoc = (location: any) => {
      observer.update("latitude", location.latitude);
      observer.update("longitude", location.longitude);
      onSave(observer.getBean())
    }
    const failLoc = (error: any) => { // could be user decline location access
      warningToast("Chưa lấy được toạ độ của bạn");
    }
    ZmpSDK.getLocation(successLoc, failLoc);
  }

  return (
    <div className="flex-v" style={{ height: "75vh" }}>
      <div>
        <Input 
          size="small" label={<InputLabel text="Tên Mộ" required/>}
          value={observer.getBean().name}
          onChange={(e) => observer.update("name", e.target.value)}
        />
        <Input 
          size="small" label={<InputLabel text="Mô Tả"/>}
          value={observer.getBean().description}
          onChange={(e) => observer.update("description", e.target.value)}
        />
      </div>

      <Button variant="primary" size="small" onClick={save} prefixIcon={<CommonIcon.Save/>}>
        {t("save")}
      </Button>

      <span>
        {"Toạ độ sẽ được lấy tại nơi bạn đang đứng"}
      </span>
    </div>
  )
}