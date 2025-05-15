import React from "react";
import { TailSpin } from "./TailSpin";

interface CardProps {
  title: string | React.ReactNode;
  src?: string;
  imgStyle?: React.CSSProperties;
  content?: string | React.ReactNode;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
  className?: string;
}
export function Card(props: CardProps) {
  const { src, title, content, onClick, width, height, className, imgStyle } = props;

  return (
    <div 
      className={`flex-v justify-between text-center ${className ? className : ""}`.trim()} 
      onClick={onClick} 
      style={{
        width: width, 
        height: height
      }}
    >
      <CardImage src={src} imgStyle={imgStyle} onClick={onClick}/>
      <CardContent title={title} content={content} />
    </div>
  )
}

interface CardImageProps {
  src?: string;
  imgStyle?: React.CSSProperties;
  onClick?: () => void;
}
function CardImage(props: CardImageProps) {
  const { src, imgStyle, onClick } = props;
  const [loading, setLoading] = React.useState(true);
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

  if (!src) return <></>;

  return (
    <>
      {loading && (
        <div className="center" style={imgStyle}>
          <TailSpin visible width={25} height={25}/>
        </div>
      )}
      {imageLoaded && (
        <img
          src={src} onClick={onClick}
          className="rounded object-cover"
          style={imgStyle}
        />
      )}
      <img
        src={src} onClick={onClick}
        className="rounded object-cover"
        style={{ display: 'none' }}
        onLoad={() => {
          setLoading(false);
          setImageLoaded(true);
        }}
      />
    </>
  )
}

interface CardContentProps {
  title: string | React.ReactNode;
  content?: string | React.ReactNode;
}
function CardContent(props: CardContentProps) {
  const { title, content } = props;

  if (typeof content === "string") {
    return (
      <div className="text-wrap"> 
        <p className="p-1 text-primary"> {title} </p>
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