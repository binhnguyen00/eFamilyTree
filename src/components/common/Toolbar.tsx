import React from "react";
import classNames from "classnames";

interface ToolbarProps {
  children: React.ReactNode;
  boxShadow?: boolean;
  glass?: boolean;
  justify?: "start" | "center" | "end" | "between" | "around";
  fitContent?: boolean;
  hide?: boolean;
}

/**
 * @param boxShadow add box shadow. default true
 * @param glass add glass effect. default true
 * @param justify justify content. default start
 * @param fitContent fit content width. default false
 * @param hide hide toolbar. default false
 * 
 * @default width: 92vw;
 */
export function Toolbar(props: ToolbarProps) {
  const { children, boxShadow = true, glass = true, justify = "start", fitContent = false, hide = false } = props;

  if (hide) {
    return null;
  }

  return (
    <div 
      className={classNames(
        "rounded p-5 scroll-h flex-h",
        {
          "shadow-lg shadow-black/25": boxShadow,
          "bg-gradient-to-br backdrop-blur-sm from-white/50 to-white/10 dark:from-black/5 dark:to-black/1": glass,
          "absolute bottom-6 left-1/2 -translate-x-1/2": true, // centered bottom
          "transition duration-300 ease-in-out": true, // animation
          "justify-start": justify === "start",
          "justify-center": justify === "center",
          "justify-end": justify === "end",
          "justify-between": justify === "between",
          "justify-around": justify === "around",
        })
      }
      style={{ 
        zIndex: 999,
        width: fitContent ? "fit-content" : "92vw",
        minHeight: "4rem"
      }}
    >
      {children}
    </div>
  )
}

export function MarginToolbar() {
  const length = 5;
  return (
    Array.from({ length }, (_, i) => i).map((i) => <br key={i}/>)
  )
}