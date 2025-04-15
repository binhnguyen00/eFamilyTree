import React from "react";

/* External cache to preserve scroll positions between mounts */
interface ScrollableDivPosition {
  scrollLeft: number; 
  scrollTop: number;
}
const scrollPositionsCache: Record<string, ScrollableDivPosition> = {};

interface ScrollableDivProps {
  id?: string;
  children: React.ReactNode;
  width?: number | string | "auto";
  height?: number | string | "auto";
  direction?: "horizontal" | "vertical" | "both";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * @param id use to cache identification (save scroll position)
 * @param width default auto
 * @param height default auto
 * @param direction default horizontal
 */
export function ScrollableDiv(props: ScrollableDivProps) {
  const { id, width = "auto", height = "auto", direction = "horizontal", children, className, style } = props; 

  const ref = React.useRef<HTMLDivElement>(null);

  const getScrollStyles = (direction: "horizontal" | "vertical" | "both") => {
    switch (direction) {
      case 'vertical':
        return { overflowY: 'auto', overflowX: 'hidden' };
      case 'horizontal':
        return { overflowX: 'auto', overflowY: 'hidden' };
      default:
        return { overflowX: 'auto', overflowY: 'auto' };
    }
  };

  React.useEffect(() => {
    if (!id) return;

    const element = ref.current; if (!element) return;
    const savedPosition = scrollPositionsCache[id];
    if (savedPosition) {
      element.scrollLeft = savedPosition.scrollLeft;
      element.scrollTop = savedPosition.scrollTop;
    }

    const handleScroll = () => {
      scrollPositionsCache[id] = {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop,
      };
    };
    element.addEventListener("scroll", handleScroll);

    return () => element.removeEventListener("scroll", handleScroll);
  }, [ id ])

  const scrollableStyle = {
    width: width,
    height: height,
    scrollBehavior: 'smooth',
    ...getScrollStyles(direction),
    ...style
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      style={scrollableStyle}
      className={`${className && className}`.trim()}
    >
      {children}
    </div>
  )
}