import React from "react";
import { TailSpin as ReactTailSpin } from 'react-loader-spinner'

interface TailSpinProps {
  width?: string | number;
  height?: string | number;
  visible?: boolean;
  color?: "primary" | "secondary";
}

export function TailSpin(props: TailSpinProps) {
  const { width = 50, height = 50, visible = true, color = "primary" } = props;

  const colorStyle: string = color === "primary" ? "var(--primary-color)" : "var(--secondary-color)";

  return (
    <ReactTailSpin
      visible={visible}
      height={height}
      width={width}
      color={colorStyle}
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
    />
  )
}
