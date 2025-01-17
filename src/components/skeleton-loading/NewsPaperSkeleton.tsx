import React, { PropsWithChildren } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * NewsPaperSkeleton
 * This will render Skeletons that look like newspaper content
 */

interface SkeletonLoadingProps {
  loading: boolean;
  content: React.ReactNode; // the hidden content that show after loading phase has finished.
  className?: string;
  image?: { 
    width?: number | string, 
    height?: number | string,
    count?: number
  }
  title?: {
    width?: number | string,
    height?: number | string,
    count?: number
  }
  text?: {
    width?: number | string,
    height?: number | string,
    count?: number
  }
}
export function NewsPaperSkeleton(props: SkeletonLoadingProps) {
  const { 
    loading, content, 
    image, title, text, className
  } = props;

  if (loading)
    return (
      <SkeletonTheme
        baseColor="#E8E8E8"
        highlightColor="white"
      >
        <div className={`flex-v ${className ? className : ""}`}>
          {/* image */}
          <Skeleton
            count={image?.count || 1}
            width={image?.width}
            height={image?.height || 100}
            enableAnimation
          />
          {/* title */}
          <Skeleton
            count={title?.count || 1}
            width={title?.width || "70%"}
            height={title?.height || 18}
            enableAnimation
          />
          {/* content */}
          <Skeleton
            count={text?.count || 3}
            width={text?.width}
            height={text?.height || 15}
            enableAnimation
          />
        </div>
      </SkeletonTheme>

    )
  else return (
    <React.Fragment>
      {content}
    </React.Fragment>
  )
}