import React from "react";
import { useLocation } from "react-router-dom";

const scrollPositions: Record<string, number> = {};

export function PagePositionSaver() {
  const location = useLocation();
  const currentScrollKey = React.useRef<string>("");

  React.useEffect(() => {
    const content = findElementWithScrollbar();
    if (!content) return;

    const key = `${location.pathname}${location.search}`;
    currentScrollKey.current = key;

    // Restore previous scroll position
    if (scrollPositions[key] !== undefined) {
      content.scrollTo(0, scrollPositions[key]);
    }

    // Save scroll position on scroll
    const saveScrollPosition = () => {
      scrollPositions[key] = content.scrollTop;
    };

    content.addEventListener("scroll", saveScrollPosition);

    // Cleanup on unmount or dependency change
    return () => {
      content.removeEventListener("scroll", saveScrollPosition);
    };
  }, [ location ]);

  return <></>;
}

function findElementWithScrollbar(rootElement: Element = document.body): Element | null {
  if (rootElement.scrollHeight > rootElement.clientHeight) {
    return rootElement; // Element has a scrollbar
  }

  for (const childElement of Array.from(rootElement.children)) {
    const elementWithScrollbar = findElementWithScrollbar(childElement);
    if (elementWithScrollbar) {
      return elementWithScrollbar;
    }
  }

  return null; // No scrollable element found
}