import { useContext } from "react";
import { NotificationContext } from "components";

export const useNotification = () => useContext(NotificationContext);