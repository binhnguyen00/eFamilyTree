import { useContext } from "react";
import { AutoLoginContext } from "components";

export const useAutoLogin = () => useContext(AutoLoginContext);