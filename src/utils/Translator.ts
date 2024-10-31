import { useTranslation } from "react-i18next";

const { t, i18n } = useTranslation();
export const T = t;

export function transtateTo(availableLang: "vi" | "en") {
  i18n.changeLanguage(availableLang);
}