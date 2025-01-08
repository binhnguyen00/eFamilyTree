import React from "react";

import { ImageWithText } from "components";

interface CardProps {
  title: string;
  src?: string;
  content?: string | React.ReactNode;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
  className?: string;
}
export function Card(props: CardProps) {
  const { src, title, content, onClick, width, height, className } = props;

  return (
    <div 
      className={`flex-v text-center border-secondary box-shadow rounded p-3 ${className ? className : ""}`} 
      onClick={onClick} 
      style={{
        width: width, 
        height: height
      }}
    >
      <CardImage src={src}/>

      <CardContent title={title} content={content} />
    </div>
  )
}

// ==========================
// CardImage
// ==========================
interface CardImageProps {
  src?: string;
  onClick?: () => void;
}
function CardImage(props: CardImageProps) {
  const { src, onClick } = props;
  if (!src) return <></>;
  return (
    <ImageWithText src={src} text="" onClick={onClick}/>
  )
}

// ==========================
// CardContent
// ==========================
interface CardContentProps {
  title: string;
  content?: string | React.ReactNode;
}
function CardContent(props: CardContentProps) {
  const { title, content } = props;

  const fontStyle = { 
    fontWeight: "bold", 
    fontSize: "1.2rem" 
  } as React.CSSProperties;

  if (typeof content !== "string") {
    return (
      <div> 
        <p className="mb-2 text-capitalize" style={{ ...fontStyle }}> {title} </p>
        {content} 
      </div>
    );
  } 

  return (
    <div> 
      <p className="mb-2 text-capitalize" style={{ ...fontStyle }}> {title} </p>
      <p> {content} </p> 
    </div>
  )
}