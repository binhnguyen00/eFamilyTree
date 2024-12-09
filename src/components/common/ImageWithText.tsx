import React from 'react';

interface ImageWithTextProps {
  text: string | React.ReactNode;
  src: any;
  textStyle?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

export function ImageWithText(props: ImageWithTextProps) {
  const { src, text, textStyle, width, height } = props;

  const overlayTextStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
    maxWidth: '80%',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    textAlign: 'center',
    ...textStyle
  } as React.CSSProperties;

  return (
    <div style={{ position: 'relative', width: width, height: height }}>
      <img
        src={src}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={overlayTextStyle}> {text} </div>
    </div>
  );
};