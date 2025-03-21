import React from "react";

import { ImageWithText } from "components";

interface CardProps {
  title: string | React.ReactNode;
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
      className={`flex-v text-center ${className ? className : ""}`.trim()} 
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
    <ImageWithText className="rounded" src={src} height={"70%"} text="" onClick={onClick}/>
  )
}

// ==========================
// CardContent
// ==========================
interface CardContentProps {
  title: string | React.ReactNode;
  content?: string | React.ReactNode;
}
function CardContent(props: CardContentProps) {
  const { title, content } = props;

  if (typeof content === "string") {
    return (
      <div className="text-wrap"> 
        <p className="p-1"> {title} </p>
        <p> {content} </p> 
      </div>
    );
  } 

  return (
    <div className="text-wrap"> 
      <p className="p-1"> {title} </p>
      {content} 
    </div>
  )
}