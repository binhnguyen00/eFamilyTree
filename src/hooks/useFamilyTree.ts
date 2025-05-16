import React from "react";

import { FamilyTreeApi } from "api";
import { useAppContext } from "hooks";
import { SelectionOption } from "components";
import { ServerResponse } from "types/server";
import { TreeDataProcessor } from "utils";
import { ServerNodeFormat } from "utils/TreeDataProcessor";

function useDeadMembers() {
  const { userInfo } = useAppContext();

  const [ members, setDeadMembers ] = React.useState<SelectionOption[]>([]);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<boolean>(false);
  const [ reload, setReload ] = React.useState<boolean>(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setDeadMembers([]);

    FamilyTreeApi.searchDeadMember({
      userId: userInfo.id, 
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        setLoading(false)
        if (result.status === "success") {
          const data = result.data as any[];
          const deadMembers = data.map((dead, idx) => {
            return {
              value: dead.id,
              label: `${dead.name}`,
            } as SelectionOption
          })
          setDeadMembers(deadMembers);
        } else {
          setLoading(false)
          setError(true);
        }
      }, 
      fail: () => {
        setLoading(false)
        setError(true);
      }
    });
  }, [ reload ]);

  return { members, loading, error, refresh }
}

function useSearchFamilyTree() {
  const { userInfo } = useAppContext();

  const [ processor, setProcessor ] = React.useState<TreeDataProcessor>(new TreeDataProcessor([]));
  const [ loading, setLoading ] = React.useState(true);
  const [ error, setError ] = React.useState(false);
  const [ reload, setReload ] = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    setProcessor(new TreeDataProcessor([]))
    
    FamilyTreeApi.searchMembers({
      userId: userInfo.id,
      clanId: userInfo.clanId,
      success: (result: ServerResponse) => {
        setLoading(false);
        if (result.status === "error") {
          setError(true);
        } else {
          const data = result.data as ServerNodeFormat[];
          const treeProcessor = new TreeDataProcessor(data);
          setProcessor(treeProcessor);
        }
      }, 
      fail: () => {
        setLoading(false);
        setError(true);
      }
    });
  }, [ reload ]);

  return { processor, loading, error, refresh }
}

function useGetActiveMembers(userId: number, clanId: number) {
  const [ activeMembers, setActiveMembers ] = React.useState<{ value: number, label: string }[]>([]);

  React.useEffect(() => {
    FamilyTreeApi.getActiveMemberIds({
      userId: userId,
      clanId: clanId,
      success: (result: ServerResponse) => {
        if (result.status === "success") {
          const data: any[] = result.data;
          const members = data.map((member, idx) => {
            return { value: member.id, label: member.name }
          })
          setActiveMembers(members);
        }
      }
    })
  }, [ userId, clanId ])

  const memoizedActiveMembers = React.useMemo(() => activeMembers, [activeMembers]);

  return { activeMembers: memoizedActiveMembers };
}

export function useFamilyTree() {
  return {
    useDeadMembers,
    useSearchFamilyTree,
    useGetActiveMembers,
  }
}