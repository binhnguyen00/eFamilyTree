import { useTheme } from "./useTheme";
import { useAutoLogin } from "./useAutoLogin";
import { useSettings } from "./useSettings";
import { useGetPhonePermission } from './useGetPhonePermission';
import { useAppContext } from './context/useAppContext';
import { usePageContext } from "./context/usePageContext";
import { useAccountContext } from "./context/useAccountContext";
import { useRouteNavigate } from "./useRouteNavigate";
import { useNotification } from "./useNotification";
import { useBeanObserver } from "./useBeanObserver";
import { useZaloSettings } from "./useZaloSettings";
import { useClanMemberInfo } from "./useClanMemberInfo";
import { useFamilyTree } from "../pages/family-tree/UIFamilyTree";
import { useRequestPhoneContext } from "./context/useRequestPhoneContext";

export { 
  useTheme, 
  useAutoLogin, 
  useSettings,
  useGetPhonePermission,
  useAppContext, usePageContext, useAccountContext, useRequestPhoneContext,
  useRouteNavigate,
  useNotification,
  useBeanObserver,
  useZaloSettings,
  useFamilyTree,
  useClanMemberInfo,
};