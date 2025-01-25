import React from "react";
import { t } from "i18next";
import { Button, Input } from "zmp-ui";

import { ZmpSDK } from "utils";
import { MemorialMapApi } from "api";
import { useAppContext, useBeanObserver, useNotification } from "hooks";
import { CommonIcon, Marker, RequestLocation, SlidingPanel, SlidingPanelOrient } from "components";

import { ServerResponse } from "types/server";

interface CreateButtonProps {
  onAdd?: (marker: Marker) => void;
}
export function CreateButton({ onAdd }: CreateButtonProps) {
  const { logedIn, zaloUserInfo } = useAppContext();

  const [ requestLoc, setRequestLoc ] = React.useState(false); 
  const [ addMarkerVisible, setAddMarkerVisible ] = React.useState(false);

  const onAddMarker = () => {
    const locationPermission = zaloUserInfo.authSettings?.["scope.userLocation"];
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
    onAdd?.({
      label: "New Marker",
      description: "New Marker",
      coordinate: {
        lat: 20.810754465924028,
        lng: 106.62409414154756
      },
      images: []
    })
    
    const saveSuccess = (result: ServerResponse) => {
      if (result.status !== "error") {
        onAdd?.({
          label: record.label,
          description: record.description,
          coordinate: {
            lat: record.latitude,
            lng: record.longitude
          },
          images: record.images
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
    <div className="flex-v" style={{ height: "70vh" }}>
      <div>
        <Input 
          size="small" label={<InputLabel text="Tên Di Tích" required/>}
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