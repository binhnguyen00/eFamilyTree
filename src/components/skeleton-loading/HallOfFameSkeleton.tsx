import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

import { SkeletonLoadingProps } from "types/skeleton-loading";

interface HallOfFameSkeletonProps extends SkeletonLoadingProps {
  className?: string
}
export function HallOfFameSkeleton(props: HallOfFameSkeletonProps) {
  const { loading, content, className } = props;

  const renderCards = () => {
    const cards = [] as React.ReactNode[];
    for (let i = 0; i < 5; i++) {
      cards.push(<HallOfFameCard />);
    }
    return cards;
  }

  if (loading) {
    return (
      <SkeletonTheme
        baseColor="#E8E8E8"
        highlightColor="white"
      >
        <div className={`flex-v ${className ? className : ""}`}>
          {renderCards()}
        </div>
      </SkeletonTheme>
    )
  } else {
    return (
      <React.Fragment>
        {content}
      </React.Fragment>
    )
  }
}

function HallOfFameCard() {
  return (
    <Skeleton
      count={1}
      width={"100%"}
      height={150}
      enableAnimation
    />
  )
}