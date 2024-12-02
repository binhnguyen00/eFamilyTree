import React from "react";
import { t } from "i18next";

import { phoneState } from "states";
import { useRecoilValue } from "recoil";
import { useNavigate } from "zmp-ui";

import { EFamilyTreeApi, FailResponse } from "utils";
import { Header } from "components";

interface UICertificateProps {
  groupId?: number
}
export default function UICertificate(props: UICertificateProps) {
  const { groupId } = props;

  const navigate = useNavigate();
  const phoneNumber = useRecoilValue(phoneState);

  const [ groups, setGroups ] = React.useState<any[]>([]);
  const [ reload, setReload ] = React.useState(false);
  const [ fetchError, setFetchError ] = React.useState(false);

  React.useEffect(() => {
    const success = (result: any[] | string) => {
      if (typeof result === "string") {
        setFetchError(true);
        console.warn(result);
      } else {
        setFetchError(false);
        setGroups(result["certificates"] || []);

        console.log(result);
      }
    }
    const fail = (error: FailResponse) => {
      setFetchError(true);
      console.error(error.stackTrace);
    }

    EFamilyTreeApi.getCerificates(phoneNumber, groupId, success, fail);
  }, [ reload ])

  const renderCertificate = () => {
    return (
      <div>

      </div>
    )
  }

  return (
    <div className="container">
      <Header title={t("certificate")}/>

      {renderCertificate()}
    </div>
  )
}