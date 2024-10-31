import { useTranslation } from "react-i18next";

const { i18n } = useTranslation();

export function transtateTo(availableLang: "vi" | "en") {
  i18n.changeLanguage(availableLang);
}