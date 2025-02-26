import React from "react";
import { TailSpin as ReactTailSpin } from 'react-loader-spinner'

interface TailSpinProps {
  visible?: boolean;
  width: string | number,
  height: string | number
}

export function TailSpin(props: TailSpinProps) {
  const { width, height, visible = true } = props;

  return (
    <ReactTailSpin
      visible={visible}
      height={height}
      width={width}
      color="var(--primary-color)"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
    />
  )
}
