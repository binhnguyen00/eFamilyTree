import React from "react";

import { ImageWithText } from "components";

interface CardProps {
  title: string;
  src?: string;
  content?: string | React.ReactNode;
  onClick?: () => void;
}
export function Card(props: CardProps) {
  const { src, title, content, onClick } = props;

  return (
    <div className="flex-v" onClick={onClick}>
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

  if (typeof content !== "string") {
    return content;
  } 

  return (
    <div className="flex-v"> 
      <h3> {title} </h3>
      <p> {content} </p> 
    </div>
  )
}