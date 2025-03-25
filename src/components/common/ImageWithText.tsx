import React from 'react';
import { TailSpin } from "./TailSpin";

interface ImageWithTextProps {
  text: string | React.ReactNode;
  src: any;
  textStyle?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  className?: string;
  onClick?: () => void;
}

export function ImageWithText(props: ImageWithTextProps) {
  const { src, text, textStyle, width, height, onClick, className } = props;

  const [loading, setLoading] = React.useState<boolean>(true);
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

  const overlayTextStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
    maxWidth: '90%',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    textAlign: 'center',
    textTransform: "capitalize",
    ...textStyle
  } as React.CSSProperties;

  return (
    <div style={{ position: 'relative', width: width, height: height }} onClick={onClick}>
      {loading && (
        <div className="center" style={{ width, height }}>
          <TailSpin visible width={25} height={25}/>
        </div>
      )}
      {imageLoaded && (
        <>
          <img
            src={src} 
            className={className ? className : ''}
            style={{ width: '100%', objectFit: 'cover' }}
          />
          <div style={overlayTextStyle}> {text} </div>
        </>
      )}
      <img
        src={src}
        style={{ display: 'none' }}
        onLoad={() => {
          setLoading(false);
          setImageLoaded(true);
        }}
      />
    </div>
  );
}