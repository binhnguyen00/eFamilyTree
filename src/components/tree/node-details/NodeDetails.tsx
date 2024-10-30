import React, { useEffect, useState } from "react";
import { Box, Input } from "zmp-ui";

import { EFamilyTreeApi } from "../../../utils/EFamilyTreeApi";

interface NodeDetailsProps {
  nodeId?: string | number;
}

export function NodeDetails({ nodeId }: NodeDetailsProps) {
  // TODO: Replace with actual phone number. Use Provider.
  const phoneNumber = import.meta.env.VITE_DEV_PHONE_NUMBER as string;
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nodeId) {
      setLoading(true);
      setError(null);

      const success = (res: any) => {
        if (res?.error) {
          setError("Unexpected error! Try again later");
        } else {
          setInfo(res.info || {});
        }
        setLoading(false);
      };

      EFamilyTreeApi.getMemberInfo(phoneNumber, nodeId as number, success);
    }
  }, [nodeId, phoneNumber]);

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Input label={"Name"} value={info.name || ""} />
          <Input label={"Phone"} value={info.phone || ""} />
        </>
      )}
    </Box>
  );
}
