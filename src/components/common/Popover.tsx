import React from "react";
import { Popover as TinyPopover, ArrowContainer, PopoverState } from "react-tiny-popover";

interface PopoverProps {
  open: boolean;
  content: React.ReactNode;
  children: React.ReactNode;
  childPosition: "top" | "bottom" | "left" | "right";
}
export function Popover(props: PopoverProps) {
  const { content, children, childPosition, open } = props;
  const [ isOpen, setIsOpen ] = React.useState(open);

  const renderPopover = ({ position, childRect, popoverRect }: PopoverState) => {
    if (children === null) return <></>;
    return (
      <ArrowContainer
        position={position}
        childRect={childRect}
        popoverRect={popoverRect}
        arrowColor={'var(--primary-color)'}
        arrowSize={9}
        className="p-1 mt-1"
      >
        <div className="bg-white p-2 rounded border text-base"> {children} </div>
      </ArrowContainer>
    )
  }

  const closePopover = () => {
    setIsOpen(false)
  }

  return (
    <TinyPopover
      isOpen={isOpen}
      positions={childPosition}
      content={renderPopover}
      // onClickOutside={closePopover} 
    >
      <div 
        className="button" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {content}
      </div>
    </TinyPopover>
  );
}