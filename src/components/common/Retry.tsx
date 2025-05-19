import React from "react";
import { Info } from "./Info";
import { t } from "i18next";
import { Button } from "zmp-ui";
import { CommonIcon } from "components/icon";

interface RetryProps {
  onClick: () => void;
  buttonType?: "primary" | "secondary" | "tertiary";
  title: string;
  message?: string;
  className?: string;
  extra?: React.ReactNode;
}

/**
 * @param title title
 * @param message message
 * @param className className
 * @param onClick onClick
 * @param extra extra React Node below retry button
 * @returns 
 */
export function Retry(props: RetryProps) {
  const { title, message, className, onClick, extra, buttonType = "tertiary" } = props;
  return (
    <div className={`${className ? className : ""}`.trim()}>
      <Info title={title} message={message}/>
      <div className="center">
        <Button className="button-link" variant={buttonType} size="small" prefixIcon={<CommonIcon.Reload size={"1rem"}/>} onClick={() => onClick()}>
          {t("retry")}
        </Button>
      </div>
      {extra}
    </div>
  )
}